#!/usr/bin/env bash

# Creates the demo account the README advertises.
#
# The account lives in the deployed MongoDB, not in this repository: a fresh
# database volume has no users, and the login form correctly refuses a
# username that is not an email address. Run this once after a rebuild.
#
# Idempotent enough: the API answers 400 "Email already exists" on a second
# run, which is the state you want to be in.
set -euo pipefail

BASE_URL="${BASE_URL:-https://andreirepo.com/apps/todo/api}"

curl -sS -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@todo.com","password":"letmein123"}' \
  -w '\nHTTP %{http_code}\n'
