# Poomrapee Portfolio — poomdev.me

Dark-themed personal portfolio site for Poomrapee Sareekachoncharu.  
Stack: **HTML / CSS / JS → Nginx → Docker → Digital Ocean Droplet**  
CI/CD: **GitHub Actions** builds and pushes a Docker image to GHCR on every push to `main`, then redeploys on the Droplet via SSH.

---

## Local Development

```bash
# Build and run locally
docker compose -f docker-compose.dev.yml up -d --build

# Open http://localhost in your browser
```

To develop without Docker, open `src/index.html` directly in a browser (no build step needed).

---

## CI/CD Overview

```
git push → main
      │
      ▼
GitHub Actions (.github/workflows/deploy.yml)
      │
      ├─ [build-and-push] Build Docker image → push to ghcr.io/poomrapees/web-portfolio:latest
      │
      └─ [deploy] SSH into Droplet → docker pull → replace container
```

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in the repo and add:

| Secret | Description |
|---|---|
| `DROPLET_HOST` | Public IP address of the Digital Ocean Droplet |
| `DROPLET_USER` | SSH username (e.g. `root` or `deploy`) |
| `DROPLET_SSH_KEY` | Contents of the **private** SSH key (e.g. `~/.ssh/id_ed25519`) |
| `GHCR_PAT` | GitHub Personal Access Token with **`read:packages`** scope |

To generate a PAT: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → `read:packages`.

---

## Digital Ocean Droplet Setup (one-time)

### 1. Create a Droplet

- Image: **Ubuntu 24.04 LTS**
- Size: Basic — 1 vCPU / 1 GB RAM (sufficient for a static site)
- Region: Choose closest to your audience
- Add your SSH public key during creation

### 2. Bootstrap the Droplet

SSH in and run:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# (Optional) Create a non-root deploy user
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
```

Set `DROPLET_USER` secret to `deploy` (or `root` if skipping the above).

### 3. Add the Deploy SSH Key

On your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key
```

Copy the **public key** to the Droplet:

```bash
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@YOUR_DROPLET_IP
```

Copy the **private key contents** into the `DROPLET_SSH_KEY` GitHub secret:

```bash
cat ~/.ssh/deploy_key   # paste this into the secret
```

### 4. First Manual Deploy (before CI/CD runs)

SSH into the Droplet and run:

```bash
echo "YOUR_GHCR_PAT" | docker login ghcr.io -u PoomrapeeS --password-stdin
docker pull ghcr.io/poomrapees/web-portfolio:latest
docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 80:80 \
  ghcr.io/poomrapees/web-portfolio:latest
```

### 5. Point DNS to the Droplet

In your domain registrar / DNS provider (for `poomdev.me`):

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `YOUR_DROPLET_IP` |
| `A` | `www` | `YOUR_DROPLET_IP` |

Wait for DNS propagation (up to 24 h, usually minutes).

### 6. Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot

# Stop the running container briefly to free port 80
docker stop portfolio

# Issue certificate (standalone mode)
certbot certonly --standalone -d poomdev.me -d www.poomdev.me \
  --non-interactive --agree-tos -m poomrapee.s@outlook.co.th

# Restart container
docker start portfolio
```

After obtaining the certificate, update the Nginx config and expose port 443 to serve HTTPS.  
Run `certbot renew` via a cron job or systemd timer for automatic renewal:

```bash
echo "0 3 * * * root certbot renew --quiet && docker restart portfolio" \
  >> /etc/cron.d/certbot-renew
```

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── src/
│   ├── index.html          # Single-page portfolio
│   ├── css/
│   │   └── style.css       # Dark theme, Electric Blue accent
│   └── js/
│       └── main.js         # Typing effect, scroll reveal, mobile nav
├── Dockerfile              # nginx:alpine — copies src/ into container
├── docker-compose.yml      # Local dev + production compose
├── nginx.conf              # Custom Nginx config with security headers
└── README.md
```
