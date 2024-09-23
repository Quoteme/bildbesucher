{
  description = ''
    Bildbesucher - A simple game where one runs through a
      picturesque landscape'';

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/flake-utils";
    };
  };

  outputs = { self, nixpkgs, flake-utils, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in rec {
        devShells.default = pkgs.mkShell {
          buildInputs =
            [ pkgs.nodePackages.jsdoc pkgs.nodePackages.http-server ];
        };
      });
}
