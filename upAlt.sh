#!/bin/bash
# vor dem ersten Mal: chmod +x up.sh

# Aktuellen Git-Status prüfen
STATUS=$(git status -s)

# Überprüfen, ob es Änderungen gibt
if [ -z "$STATUS" ]; then
    echo "Keine Änderungen zum Commiten."
    exit 0
fi

# Änderungen anzeigen
git status

# Benutzer fragen, ob er bestimmte Dateien oder alle hinzufügen möchte
read -p "Möchten Sie alle Änderungen hinzufügen? (y/N) " allchoice

case "$allchoice" in
    y|Y)
        git add .
        ;;
    *)
        echo "Geben Sie die Dateien ein, die Sie hinzufügen möchten, getrennt durch Leerzeichen:"
        read files
        git add $files
        ;;
esac

# Commit
read -p "Geben Sie Ihre Commit-Nachricht ein: " commitmsg
git commit -m "$commitmsg"

# Push
read -p "Möchten Sie jetzt pushen? (y/N) " pushchoice

case "$pushchoice" in
    y|Y)
        git push
        ;;
    *)
        echo "Push abgebrochen."
        ;;
esac
