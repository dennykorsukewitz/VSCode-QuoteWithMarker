<img align="right" width="150" height="150" src="doc/images/icon.png">

# QuoteWithMarker

**QuoteWithMarker** is an extension that quotes the selected area and adds a custom marker to it.

| Repository | GitHub | Visual Studio Marketplace |
| ------ | ------ | ------ |
| ![GitHub release (latest by date)](https://img.shields.io/github/v/release/dennykorsukewitz/VSCode-QuoteWithMarker) | ![GitHub open issues](https://img.shields.io/github/issues/dennykorsukewitz/VSCode-QuoteWithMarker) ![GitHub closed issues](https://img.shields.io/github/issues-closed/dennykorsukewitz/VSCode-QuoteWithMarker?color=#44CC44) | ![Visual Studio Marketplace last-updated](https://img.shields.io/visual-studio-marketplace/last-updated/dennykorsukewitz.QuoteWithMarker) ![Visual Studio Marketplace Version ](https://img.shields.io/visual-studio-marketplace/v/dennykorsukewitz.QuoteWithMarker) |
| ![GitHub license](https://img.shields.io/github/license/dennykorsukewitz/VSCode-QuoteWithMarker) | ![GitHub pull requests](https://img.shields.io/github/issues-pr/dennykorsukewitz/VSCode-QuoteWithMarker?label=PR) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/dennykorsukewitz/VSCode-QuoteWithMarker?color=g&label=PR) | ![Visual Studio Marketplace Rating release-date](https://img.shields.io/visual-studio-marketplace/release-date/dennykorsukewitz.QuoteWithMarker) |
| ![GitHub language count](https://img.shields.io/github/languages/count/dennykorsukewitz/VSCode-QuoteWithMarker?style=flat&label=language)  | ![GitHub contributors](https://img.shields.io/github/contributors/dennykorsukewitz/VSCode-QuoteWithMarker) | ![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/dennykorsukewitz.QuoteWithMarker) ![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/dennykorsukewitz.QuoteWithMarker) |
| ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/dennykorsukewitz/VSCode-QuoteWithMarker)  | ![GitHub downloads](https://img.shields.io/github/downloads/dennykorsukewitz/VSCode-QuoteWithMarker/total?style=flat) | ![VSC marketplace download](https://img.shields.io/visual-studio-marketplace/d/dennykorsukewitz.QuoteWithMarker) ![VSC marketplace install](https://img.shields.io/visual-studio-marketplace/i/dennykorsukewitz.QuoteWithMarker) |

| Status |
 | ------ |
| [![GitHub commits since tagged version](https://img.shields.io/github/commits-since/dennykorsukewitz/VSCode-QuoteWithMarker/1.1.1/dev)](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/compare/1.1.1...dev) ![GitHub Workflow Lint](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/actions/workflows/lint.yml/badge.svg?branch=dev&style=flat&label=Lint) ![GitHub Workflow Pages](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/actions/workflows/pages.yml/badge.svg?branch=dev&style=flat&label=GitHub%20Pages) |

## Feature

Sometimes you have to mark and comment code. Here is the QuoteWithMarker very helpful.
This function quotes the selected area and adds a custom marker to it.
This way you can still trace the original code.
There is also a start and end block for better display when merging.

`QuoteWithMarker` can be very useful especially for patch files.

**Shortcut:** ```strg + alt + k, q```<br>
**Command:**  ```QuoteWithMarker: Quote with Marker.```

<details>
  <summary>Works for the following languages:</summary>

| LanguageID              | LineComment |
| ----------------------- | ----------- |
| bat                     | @REM        |
| clojure                 | ;;          |
| coffeescript            | #           |
| c                       | //          |
| cpp                     | //          |
| cuda-cpp                | //          |
| csharp                  | //          |
| CSS                     |             |
| dart                    | //          |
| diff                    | #           |
| dockerfile              | #           |
| fsharp                  | //          |
| git-commit              | #           |
| git-rebase              | #           |
| ignore                  | #           |
| go                      | //          |
| groovy                  | //          |
| handlebars              |             |
| hlsl                    | //          |
| HTML                    |             |
| ini                     | ;           |
| plaintext               | #           |
| java                    | //          |
| javascriptreact         | //          |
| JavaScript              | //          |
| jsx-tags                |             |
| json                    | //          |
| jsonc                   | //          |
| jsonl                   | //          |
| julia                   | #           |
| tex                     | %           |
| latex                   | %           |
| cpp_embedded_latex      | //          |
| markdown_latex_combined |             |
| less                    | //          |
| lua                     | --          |
| makefile                | #           |
| Markdown                |             |
| objective-c             | //          |
| objective-cpp           | //          |
| perl                    | #           |
| perl6                   | #           |
| php                     | //          |
| powershell              | #           |
| jade                    | //-         |
| python                  | #           |
| r                       | #           |
| razor                   |             |
| restructuredtext        | ..          |
| ruby                    | #           |
| rust                    | //          |
| SCSS                    | //          |
| shaderlab               | //          |
| shellscript             | #           |
| sql                     | --          |
| swift                   | //          |
| TypeScript              | //          |
| typescriptreact         | //          |
| vb                      | '           |
| xml                     |             |
| xsl                     |             |
| dockercompose           | #           |
| yaml                    | #           |

</details>

<br>

![QuoteWithMarker](doc/images/quotewithmarker.gif)

### Settings

`Preferences -> Settings -> Extensions -> QuoteWithMarker`

| Name | Description | Default Value |
| - | - | - |
| quoteWithMarker.codeMarker | Code Marker used in QuoteWithMarker function. | MyMarker |
| quoteWithMarker.lineComment | This is a mapping between LanguageID and lineComment characters. | All possible lineComment's |

![Settings](doc/images/settings.png)

---

## Installation

To install this extension, you have **three** options:

### 1. Search Extension in Marketplace

Search and install online extension via VSC extensions menu.

`Code` -> `Preferences` -> `Extensions` simply search for `QuoteWithMarker` to install.

### 2. Install via vsix file

Download latest [vsix file](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/releases) and install via extensions menu.

`Code` -> `Preferences` -> `Extensions` -> `Views and More Action` -> `Install from VSIX`.

### 3. Source code

Download archive with the latest [release](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/releases) and unpack it to VisualStudioCode extensions folder
`$HOME/.vscode/extensions/`.

---

## Download

For download see [VSCode-QuoteWithMarker](https://github.com/dennykorsukewitz/VSCode-QuoteWithMarker/releases)

---

Enjoy!

Your [Denny Korsukéwitz](https://github.com/dennykorsukewitz) 🚀
