d="$(mktemp)"
exec 17>"$d"
files=( *.js )
for _ in "${files[@]}"; do
  echo -n "."
done
echo
for file in "${files[@]}"; do
  (
    grep -HEne 'console\.log' "$file" >&17
    grep -HEne 'console\.error' "$file" >&17
    grep -HEne 'console\.warn' "$file" >&17
    echo -ne "^"
  ) &
done
exec 17>&-
wait
sort <$d >189.plan