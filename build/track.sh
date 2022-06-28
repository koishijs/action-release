REG=^$(echo $1 | sed 's/\./\\./g')$
[ -z "$(git tag -l | grep -E $REG)" ] || git tag -d $1
git tag -a $1 -m "Tracking $1"
