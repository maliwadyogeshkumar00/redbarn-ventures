#!/bin/zsh
# place-img.sh <name> : takes the newest Gemini image in ~/Downloads, trims the corner mark, saves public/images/<name>.jpg
f=$(ls -t ~/Downloads/Gemini_Generated_Image_*.png 2>/dev/null | head -1)
[ -z "$f" ] && { echo "no image"; exit 1; }
w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}'); h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')
nw=$(( w * 92 / 100 )); nh=$(( h * 92 / 100 ))
tmp=/tmp/pi_$1.png
sips -c $nh $nw --cropOffset 0 0 "$f" --out $tmp >/dev/null
sips -Z 1600 -s format jpeg -s formatOptions 80 $tmp --out public/images/$1.jpg >/dev/null
mkdir -p ~/Downloads/redbarn-gemini && mv "$f" ~/Downloads/redbarn-gemini/$1.png
ls -la public/images/$1.jpg | awk '{print $5, $9}'
