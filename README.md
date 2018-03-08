# fdg-2d-talk

This repo contains some 2D Force Directed Graphs suitable for inclusion in talks, etc.

# Create a gh-pages branch

## Create a new clean repo

```
git clone https://github.com/FNNDSC/fdg-2d-talk
cd fdg-2d-talk/
git checkout --orphan gh-pages
git rm -rf .
cp -r /original/path/fdg-2d-talk/* .
git add -A
git commit -a -m "Commit to gh-pages"
git push origin gh-pages
```

## Sync with master

```
$ git checkout gh-pages // go to the gh-pages branch
$ git rebase master // bring gh-pages up to date with master
$ git push origin gh-pages // commit the changes
$ git checkout master // return to the master branch
```

