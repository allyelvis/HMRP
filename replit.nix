{ pkgs }: {
  deps = [
    pkgs.postgresql_11_jit
    pkgs.mastodon
    pkgs.golines
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}