RAW=v$(cat package.json | grep '"version":' | cut -d '"' -f 4)
REG=^$(echo $RAW | sed 's/\./\\./g')$
NEW=$([ -z "$(git tag -l | grep -E $REG)" ] && echo "$RAW")
echo "::set-output name=tag::$RAW"
echo "::set-output name=new::$NEW"
