{ pkgs }: {
  deps = [
    pkgs.mastodon
    pkgs.golines
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}