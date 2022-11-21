#!/usr/bin/env bash

__powerline() {
  # Unicode symbols
  readonly GIT_BRANCH_CHANGED_SYMBOL='+'
  readonly GIT_NEED_PULL_SYMBOL='⇣'
  readonly GIT_NEED_PUSH_SYMBOL='⇡'

  # Solarized colorscheme
  readonly BG_BASE00="\\[$(tput setab 11)\\]"
  readonly BG_BASE01="\\[$(tput setab 10)\\]"
  readonly BG_BASE02="\\[$(tput setab 0)\\]"
  readonly BG_BASE03="\\[$(tput setab 8)\\]"
  readonly BG_BASE0="\\[$(tput setab 12)\\]"
  readonly BG_BASE1="\\[$(tput setab 14)\\]"
  readonly BG_BASE2="\\[$(tput setab 7)\\]"
  readonly BG_BASE3="\\[$(tput setab 15)\\]"
  readonly BG_BLUE="\\[$(tput setab 4)\\]"
  readonly BG_COLOR1="\\[\\e[48;5;240m\\]"
  readonly BG_COLOR2="\\[\\e[48;5;238m\\]"
  readonly BG_COLOR3="\\[\\e[48;5;238m\\]"
  readonly BG_COLOR4="\\[\\e[48;5;31m\\]"
  readonly BG_COLOR5="\\[\\e[48;5;31m\\]"
  readonly BG_COLOR6="\\[\\e[48;5;237m\\]"
  readonly BG_COLOR7="\\[\\e[48;5;237m\\]"
  readonly BG_COLOR8="\\[\\e[48;5;161m\\]"
  readonly BG_COLOR9="\\[\\e[48;5;161m\\]"
  readonly BG_CYAN="\\[$(tput setab 6)\\]"
  readonly BG_GREEN="\\[$(tput setab 2)\\]"
  readonly BG_MAGENTA="\\[$(tput setab 5)\\]"
  readonly BG_ORANGE="\\[$(tput setab 9)\\]"
  readonly BG_RED="\\[$(tput setab 1)\\]"
  readonly BG_VIOLET="\\[$(tput setab 13)\\]"
  readonly BG_YELLOW="\\[$(tput setab 3)\\]"
  readonly BOLD="\\[$(tput bold)\\]"
  readonly DIM="\\[$(tput dim)\\]"
  readonly FG_BASE00="\\[$(tput setaf 11)\\]"
  readonly FG_BASE01="\\[$(tput setaf 10)\\]"
  readonly FG_BASE02="\\[$(tput setaf 0)\\]"
  readonly FG_BASE03="\\[$(tput setaf 8)\\]"
  readonly FG_BASE0="\\[$(tput setaf 12)\\]"
  readonly FG_BASE1="\\[$(tput setaf 14)\\]"
  readonly FG_BASE2="\\[$(tput setaf 7)\\]"
  readonly FG_BASE3="\\[$(tput setaf 15)\\]"
  readonly FG_BLUE="\\[$(tput setaf 4)\\]"
  readonly FG_COLOR1="\\[\\e[38;5;250m\\]"
  readonly FG_COLOR2="\\[\\e[38;5;240m\\]"
  readonly FG_COLOR3="\\[\\e[38;5;250m\\]"
  readonly FG_COLOR4="\\[\\e[38;5;238m\\]"
  readonly FG_COLOR6="\\[\\e[38;5;31m\\]"
  readonly FG_COLOR7="\\[\\e[38;5;250m\\]"
  readonly FG_COLOR8="\\[\\e[38;5;237m\\]"
  readonly FG_COLOR9="\\[\\e[38;5;161m\\]"
  readonly FG_CYAN="\\[$(tput setaf 6)\\]"
  readonly FG_GREEN="\\[$(tput setaf 2)\\]"
  readonly FG_MAGENTA="\\[$(tput setaf 5)\\]"
  readonly FG_ORANGE="\\[$(tput setaf 9)\\]"
  readonly FG_RED="\\[$(tput setaf 1)\\]"
  readonly FG_VIOLET="\\[$(tput setaf 13)\\]"
  readonly FG_YELLOW="\\[$(tput setaf 3)\\]"
  readonly RESET="\\[$(tput sgr0)\\]"
  readonly REVERSE="\\[$(tput rev)\\]"

  if [ "$0" = "$BASH_SOURCE" ]; then
    ( # I am aware that this is not the recommended way, but my syntax highlighter hates it.
      sed -E 's/\\\[|\\]//g' |
      sed -E 's/\\e/'$'\e''/g'
    ) <<EOF
${RESET}Foreground
${RESET}  base    ${FG_BASE00}00$RESET ${FG_BASE01}01$RESET ${FG_BASE02}02$RESET ${FG_BASE03}03$RESET ${FG_BASE0}0$RESET ${FG_BASE1}1$RESET ${FG_BASE2}2$RESET ${FG_BASE3}3$RESET
${RESET}  colors  ${FG_COLOR1}1$RESET ${FG_COLOR2}2$RESET ${FG_COLOR3}3$RESET ${FG_COLOR4}4$RESET ${FG_COLOR5}5$RESET ${FG_COLOR6}6$RESET ${FG_COLOR7}7$RESET ${FG_COLOR8}8$RESET ${FG_COLOR9}9$RESET
${RESET}  names   ${FG_BLUE}blue$RESET ${FG_CYAN}cyan$RESET ${FG_GREEN}green$RESET ${FG_MAGENTA}magenta$RESET ${FG_ORANGE}orange$RESET ${FG_RED}red$RESET ${FG_VIOLET}violet$RESET ${FG_YELLOW}yellow$RESET
${RESET}Background
${RESET}  base    ${BG_BASE00}00$RESET ${BG_BASE01}01$RESET ${BG_BASE02}02$RESET ${BG_BASE03}03$RESET ${BG_BASE0}0$RESET ${BG_BASE1}1$RESET ${BG_BASE2}2$RESET ${BG_BASE3}3$RESET
${RESET}  colors  ${BG_COLOR1}1$RESET ${BG_COLOR2}2$RESET ${BG_COLOR3}3$RESET ${BG_COLOR4}4$RESET ${BG_COLOR5}5$RESET ${BG_COLOR6}6$RESET ${BG_COLOR7}7$RESET ${BG_COLOR8}8$RESET ${BG_COLOR9}9$RESET
${RESET}  names   ${BG_BLUE}blue$RESET ${BG_CYAN}cyan$RESET ${BG_GREEN}green$RESET ${BG_MAGENTA}magenta$RESET ${BG_ORANGE}orange$RESET ${BG_RED}red$RESET ${BG_VIOLET}violet$RESET ${BG_YELLOW}yellow$RESET
$RESET
EOF
  fi

  add_theme() {
    declare -n "FG_THEME_$1"="FG_$2"
    declare -n "BG_THEME_$1"="BG_$2"
  }

  add_theme GIT_DIRTY RED
  add_theme GIT_CLEAN BLUE
  add_theme GIT_DETACHED_CLEAN MAGENTA
  add_theme GIT_DETACHED_DIRTY YELLOW

  [ "$0" = "$BASH_SOURCE" ] && bash

  [ -f .powerline-theme.sh ] && . .powerline-theme.sh
  __git_info() {
    # no .git directory
    [ -d .git ] || return

    local aheadN
    local behindN
    local branch
    local marks
    local stats

    # get current branch name or short SHA1 hash for detached head
    branch="$(git symbolic-ref --short HEAD 2>/dev/null || git describe --tags --always 2>/dev/null)"
    [ -n "$branch" ] || return  # git branch not found
  
    # how many commits local branch is ahead/behind of remote?
    stats="$(git status --porcelain --branch | grep '^##' | grep -o '\[.\+\]$')"
    aheadN="$(echo "$stats" | grep -o 'ahead \d\+' | grep -o '\d\+')"
    behindN="$(echo "$stats" | grep -o 'behind \d\+' | grep -o '\d\+')"
    [ -n "$aheadN" ] && marks+=" $GIT_NEED_PUSH_SYMBOL$aheadN"
    [ -n "$behindN" ] && marks+=" $GIT_NEED_PULL_SYMBOL$behindN"
  
    # print the git branch segment without a trailing newline
    # branch is modified?
    vn="_THEME_GIT_"
    vn+="$(git symbolic-ref --short HEAD >/dev/null 2>&1 || echo "DETACHED_")"
    vn+="$([ -n "$(git status --porcelain)" ] && echo "DIRTY" || echo "CLEAN")"
    fgn="FG$vn"
    bgn="BG$vn"
    FG_GIT="${!fgn}"
    BG_GIT="${!fgn}"
    echo -n ${fgn}\"${FG_GIT}\"fgn

    # a = (attached ? 0 : 128), (clean ? 0 : 1)
        
    printf "%s" "${BG_GIT}${RESET}${BG_GIT} $branch$marks ${RESET}${FG_GIT}"
  }
  
  shlvl() {
    [ $SHLVL = 1 ] || printf '| %.0s' {2..$SHLVL}
  }
  
  ps1() {
    # Check the exit code of the previous command and display different
    # colors in the prompt accordingly.
    local REALCODE=$?
    local gitinfo="$(__git_info)"
    if [ "$REALCODE" -eq 0 ]; then
      local PBAR="${RESET}$FG_GIT"
    elif [ "$REALCODE" -gt 128 ] && kill -l $(( REALCODE - 128 )) >/dev/null 2>&1; then
      local PBAR="$BG_YELLOW $(kill -l $(( REALCODE - 128 )) 2>&1) ${RESET}$FG_YELLOW"
    else
      local PBAR="$BG_RED $REALCODE ${RESET}$FG_RED"
    fi
  
    PS1="$FG_COLOR1"
    PS1+="$BG_COLOR5 \\w "
    PS1+="$RESET${FG_COLOR6}"
    PS1+="$gitinfo"
    PS1+="$PBAR$RESET "
  }
  
  PROMPT_COMMAND=ps1
}

__powerline
unset __powerline
