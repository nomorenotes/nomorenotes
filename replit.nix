
{ pkgs }: {
  deps = [
    pkgs.pv
    pkgs.openssh_with_kerberos
    pkgs.lolcat
    pkgs.sl
    pkgs.dialog
    pkgs.jq.bin
    pkgs.less
    pkgs.busybox
    pkgs.gnupg
    pkgs.vim
    pkgs.screen
    pkgs.heroku
    pkgs.nodejs-16_x
    pkgs.nano
    pkgs.python3
  ];
}