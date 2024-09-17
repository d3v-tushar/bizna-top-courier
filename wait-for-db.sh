#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

until getent hosts $host || ping -c 1 $host; do
  >&2 echo "Cannot resolve $host - waiting for DNS resolution..."
  sleep 2
done

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "biznatop" -d "biznadb" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

>&2 echo "Postgres is up - executing command"
exec $cmd