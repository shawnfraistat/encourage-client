curl --include --request POST "http://localhost:4741/authors/" \
  --header "Content-Type: application/json" \
  --data '{
      "author": {
        "first_name": "'"${FIRST}"'",
        "last_name": "'"${LAST}"'"
      }
  }'
