
{ pkgs }: {
  deps = [
    pkgs.busybox
    pkgs.gnupg
    pkgs.vim
    pkgs.screen
    pkgs.heroku
    pkgs.less
    pkgs.nodejs-16_x
    pkgs.nano
    pkgs.python3
  ];
}