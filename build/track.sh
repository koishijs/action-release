REG=^$(echo $1 | sed 's/\./\\./g')$

if [ -n "$(git tag -l | grep -E $REG)" ]; then
  git tag -d $1
  git push origin :refs/tags/$1
fi

git tag -a $1 -m "Tracking $1"
