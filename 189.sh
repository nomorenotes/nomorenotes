rm 189.plan
files=( *.js )
for _ in "${files[@]}"; do
  echo -n "."
done
echo
for file in "${files[@]}"; do
  (
    grep -HEne 'console\.log' "$file" >> 189.plan
    grep -HEne 'console\.error' "$file" >> 189.plan
    grep -HEne 'console\.warn' "$file" >> 189.plan
    echo -ne "^"
  ) &
done
wait
echo