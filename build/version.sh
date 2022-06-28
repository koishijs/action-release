TAG=v$(cat package.json | grep '"version":' | cut -d '"' -f 4)
REG=^$(echo $TAG | sed 's/\./\\./g')$

if [ -z "$(git tag -l | grep -E $REG)" ]; then
  echo ::set-output name=tag::$TAG
  echo new version detected: $TAG
fi
