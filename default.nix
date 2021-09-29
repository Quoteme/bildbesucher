{ pkgs ? import <nixpkgs> {} }: with pkgs;
stdenv.mkDerivation rec {
  version = "0.1";
  pname = "story";
  src = ./.;
  buildInputs = [
    nodePackages.http-server
    nodePackages.jsdoc
  ];
  buildPhase = "ghc --make xmonadctl.hs";
  installPhase = ''
    mkdir -p $out/bin
    cp xmonadctl $out/bin/
    chmod +x $out/bin/xmonadctl
  '';
}
