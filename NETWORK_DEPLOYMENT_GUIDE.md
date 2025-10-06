# Family Fork - Network Deployment Guide

**For Your Friend's Gaming PC/Laptop Setup**

This guide will help you set up Family Fork so it can be accessed from your phone, tablet, or any device on your local network (WiFi) or even through cellular data.

## 🚀 Quick Start (Recommended)

### Step 1: Download and Setup
1. **Download Family Fork** to your gaming PC/laptop
2. **Install Docker Desktop** (if not already installed)
3. **Open Command Prompt** (Windows) or Terminal (Mac/Linux)

### Step 2: Start Family Fork for Network Access
**Windows:**
```bash
# Navigate to Family Fork folder
cd path/to/FamilyFork

# Start with network access
start_familyfork_network.bat
```

**Mac/Linux:**
```bash
# Navigate to Family Fork folder
cd path/to/FamilyFork

# Make script executable
chmod +x start_familyfork_network.sh

# Start with network access
./start_familyfork_network.sh
```

### Step 3: Access from Your Devices
The script will show you the network addresses. You'll see something like:
```
Network Access (from other devices):
  Frontend: http://192.168.1.100:3000
  Backend API: http://192.168.1.100:8000
```

## 📱 Mobile/Tablet Access

### WiFi Access (Same Network)
1. **Connect your phone/tablet to the same WiFi** as your gaming PC
2. **Open your mobile browser** (Chrome, Safari, etc.)
3. **Go to the network address** shown by the script (e.g., `http://192.168.1.100:3000`)
4. **Bookmark the address** for easy access

### Cellular Data Access (Advanced)
For access from anywhere (not just home WiFi):

#### Option 1: Port Forwarding (Router Setup)
1. **Access your router settings** (usually `192.168.1.1` or `192.168.0.1`)
2. **Set up port forwarding** for ports 3000 and 8000
3. **Use your public IP** instead of local IP
4. **Security Note**: This exposes your app to the internet

#### Option 2: VPN Solution (Recommended)
1. **Set up a VPN** (like Tailscale, ZeroTier, or WireGuard)
2. **Install VPN on both** your gaming PC and mobile devices
3. **Access using VPN IP** instead of local IP
4. **More secure** than port forwarding

## 🎮 Gaming PC Setup

### System Requirements
- **RAM**: 8GB+ recommended (4GB minimum)
- **Storage**: 5GB free space
- **Network**: Stable internet connection
- **Docker**: Docker Desktop installed

### Performance Optimization
- **Close unnecessary programs** while running Family Fork
- **Use wired internet** for better stability
- **Monitor resource usage** in Task Manager

### Firewall Configuration
**Windows:**
1. **Windows Defender Firewall** → Allow an app through firewall
2. **Add Docker Desktop** and **Node.js** to allowed apps
3. **Allow ports 3000 and 8000** through firewall

**Mac:**
1. **System Preferences** → Security & Privacy → Firewall
2. **Allow Docker Desktop** through firewall
3. **Allow incoming connections** for ports 3000 and 8000

## 📊 Network Configuration

### Automatic IP Detection
The deployment script automatically detects your local IP address and configures the application. Common IP ranges:
- **192.168.1.x** (Most home routers)
- **192.168.0.x** (Some routers)
- **10.0.0.x** (Some corporate networks)
- **172.16.x.x** (Some networks)

### Manual IP Configuration
If automatic detection fails:
1. **Find your IP address**:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
2. **Update the environment** in `docker-compose.network.yml`
3. **Restart the services**

## 🔧 Troubleshooting

### Common Issues

#### "Cannot access from mobile device"
**Solutions:**
1. **Check firewall settings** on your gaming PC
2. **Verify both devices are on same WiFi**
3. **Try different browser** on mobile device
4. **Check router settings** for device isolation

#### "Services won't start"
**Solutions:**
1. **Check Docker is running**: `docker --version`
2. **Check ports are available**: `netstat -an | findstr :3000`
3. **Restart Docker Desktop**
4. **Check available disk space**

#### "Slow performance"
**Solutions:**
1. **Close other applications** on gaming PC
2. **Use wired internet connection**
3. **Check available RAM** in Task Manager
4. **Restart the services**

### Network Diagnostics
**Test connectivity:**
```bash
# From mobile device, test if ports are accessible
# Use a network scanner app or online port checker
# Test: http://YOUR_PC_IP:3000
```

**Check service status:**
```bash
# Check if services are running
docker-compose -f docker-compose.network.yml ps

# Check service logs
docker-compose -f docker-compose.network.yml logs
```

## 📱 Mobile App Experience

### Browser Recommendations
- **Chrome** (Android/iOS) - Best compatibility
- **Safari** (iOS) - Good for iOS devices
- **Firefox** (Android/iOS) - Alternative option

### Mobile Features
- **Barcode Scanning**: Use camera to scan product barcodes
- **Touch Interface**: Optimized for touch screens
- **Responsive Design**: Works on phones and tablets
- **Offline Capability**: Some features work without internet

### Mobile Setup Tips
1. **Add to home screen** for app-like experience
2. **Enable camera permissions** for barcode scanning
3. **Use landscape mode** for better interface
4. **Bookmark the address** for quick access

## 🔒 Security Considerations

### Local Network Security
- **Only accessible on your WiFi** (by default)
- **No internet exposure** unless configured
- **Family members only** can access
- **Data stays on your computer**

### Advanced Security (Optional)
- **Set up authentication** for additional security
- **Use HTTPS** for encrypted connections
- **Regular backups** of your data
- **Monitor access logs**

## 🚀 Advanced Deployment

### Cloud Deployment (Optional)
For access from anywhere without VPN:
1. **Deploy to cloud** (AWS, Google Cloud, Azure)
2. **Use domain name** instead of IP address
3. **Set up SSL certificate** for HTTPS
4. **Configure authentication** for security

### Docker Swarm (Advanced)
For high availability:
1. **Set up Docker Swarm** cluster
2. **Deploy across multiple nodes**
3. **Load balancing** for better performance
4. **Automatic failover** capabilities

## 📞 Support

### Getting Help
1. **Check the logs**: `docker-compose logs`
2. **Restart services**: `docker-compose restart`
3. **Update Docker**: Ensure latest Docker Desktop
4. **Check network**: Verify WiFi connectivity

### Emergency Reset
If everything stops working:
```bash
# Stop all services
docker-compose -f docker-compose.network.yml down

# Remove all containers and volumes
docker-compose -f docker-compose.network.yml down -v

# Start fresh
start_familyfork_network.bat  # or .sh
```

## 🎯 Quick Reference

### Essential Commands
```bash
# Start with network access
start_familyfork_network.bat

# Check status
docker-compose -f docker-compose.network.yml ps

# View logs
docker-compose -f docker-compose.network.yml logs

# Stop services
docker-compose -f docker-compose.network.yml down
```

### Access URLs
- **Local**: `http://localhost:3000`
- **Network**: `http://YOUR_IP:3000`
- **API**: `http://YOUR_IP:8000`
- **Docs**: `http://YOUR_IP:8000/docs`

---

**Ready to get started?** Run the network deployment script and start using Family Fork from any device on your network! 🍽️📱

