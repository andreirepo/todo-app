# Kubernetes Deployment Guide

This guide covers deploying the Todo App to Kubernetes using the created manifests.

## Prerequisites

- Kubernetes cluster (k3s on Proxmox or AWS Lightsail)
- kubectl configured
- Nginx Ingress Controller installed
- cert-manager for SSL certificates (optional but recommended)

## Quick Start

### 1. Set up MongoDB Atlas

1. Create a free MongoDB Atlas cluster
2. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/todos`
3. Update `k8s/secrets/mongo-secret.yaml` with your credentials

### 2. Deploy to Kubernetes

```bash
# Apply namespace
kubectl apply -f k8s/namespace.yaml

# Apply secrets (update with your credentials first)
kubectl apply -f k8s/secrets/mongo-secret.yaml

# Apply configuration
kubectl apply -f k8s/configmaps/

# Apply deployments
kubectl apply -f k8s/deployments/

# Apply services
kubectl apply -f k8s/services/

# Apply ingress
kubectl apply -f k8s/ingress/

# Wait for rollout
kubectl rollout status deployment/todo-frontend -n todo-app
kubectl rollout status deployment/todo-backend -n todo-app
```

### 3. Set up Monitoring (Optional)

```bash
# Install monitoring stack
kubectl apply -f k8s/monitoring/

# Install Prometheus Operator (if not already installed)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Username: admin, Password: prom-operator
```

## Environment Variables

### Backend
- `NODE_ENV`: Application environment (production)
- `PORT`: Server port (5000)
- `UV_THREADPOOL_SIZE`: Node.js thread pool size (16)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT expiration time (7d)

### Frontend
- `REACT_APP_API_URL`: API endpoint (/api)
- `REACT_APP_BASE_URL`: Base URL (/)

## Monitoring

The deployment includes:
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **ServiceMonitor**: Automatic metric scraping
- **Alerts**: Health checks and performance monitoring

### Key Metrics
- Application health (up/down)
- HTTP request rate and latency
- Error rates
- Resource usage (CPU, memory)

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n todo-app
kubectl describe pod <pod-name> -n todo-app
kubectl logs <pod-name> -n todo-app
```

### Check Ingress
```bash
kubectl get ingress -n todo-app
kubectl describe ingress todo-app-ingress -n todo-app
```

### Check Services
```bash
kubectl get services -n todo-app
kubectl describe service todo-backend-service -n todo-app
```

## SSL Configuration

The ingress is configured for automatic SSL with Let's Encrypt:
- Ensure your domain (todo.andreiqa.click) points to your cluster IP
- cert-manager will automatically provision SSL certificates
- SSL is enforced with redirects

## Rollback Strategy

### Helm Rollback (if using Helm)
```bash
helm rollback todo-app 1 -n todo-app
```

### kubectl Rollback
```bash
kubectl rollout undo deployment/todo-backend -n todo-app
kubectl rollout undo deployment/todo-frontend -n todo-app
```

### ArgoCD Rollback
If using ArgoCD, use the ArgoCD UI or CLI:
```bash
kubectl argo rollouts undo deployment todo-backend -n todo-app
```

## Next Steps

1. **Set up ArgoCD** for GitOps deployment
2. **Configure alerts** in Grafana
3. **Set up log aggregation** with Loki or ELK stack
4. **Add resource monitoring** for MongoDB Atlas
5. **Configure backup strategies** for data persistence