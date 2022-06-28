RAW=v$(cat package.json | grep '"version":' | cut -d '"' -f 4)
REG=^$(echo $RAW | sed 's/\./\\./g')$

if [ -z "$(git tag -l | grep -E $REG)" ]; then
  echo ::set-output name=tag::$RAW
  echo change detected: $RAW
fi
