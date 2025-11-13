#!/bin/bash

# Database Backup Script for Production
# Usage: ./backup.sh [docker|manual]

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups}"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-crud_db}"
DB_USER="${DB_USER:-postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Determine deployment method
DEPLOYMENT_METHOD="${1:-docker}"

echo "Starting backup at $(date)"
echo "Deployment method: $DEPLOYMENT_METHOD"
echo "Database: $DB_NAME"
echo "Backup directory: $BACKUP_DIR"

if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
    # Docker deployment backup
    echo "Creating Docker backup..."
    
    # Check if docker-compose is available
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        echo "Error: docker-compose not found"
        exit 1
    fi
    
    # Create backup
    $COMPOSE_CMD -f docker-compose.prod.yml exec -T postgres \
        pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_$DATE.sql"
    
elif [ "$DEPLOYMENT_METHOD" = "manual" ]; then
    # Manual deployment backup
    echo "Creating manual backup..."
    
    pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_DIR/backup_$DATE.sql"
    
else
    echo "Error: Invalid deployment method. Use 'docker' or 'manual'"
    exit 1
fi

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_DIR/backup_$DATE.sql"

BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "Backup completed: $BACKUP_FILE ($BACKUP_SIZE)"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup process completed at $(date)"

