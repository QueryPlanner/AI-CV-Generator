#set text(font: "Source Sans 3")
#set page(margin: 2cm)

= Font Awesome Icon Test

This document tests Font Awesome icon rendering in Typst. If Font Awesome is properly installed and recognized, you should see icons below instead of empty boxes or question marks.

== Testing Brand Icons (fa-brands-400.ttf / woff2)

LinkedIn icon: #text(font: "fa-brands-400")["\uf08c"]

GitHub icon: #text(font: "fa-brands-400")["\uf09b"]

Twitter icon: #text(font: "fa-brands-400")["\uf099"]

Facebook icon: #text(font: "fa-brands-400")["\uf09a"]

== Testing Regular Icons (fa-regular-400.ttf / woff2)

Email icon: #text(font: "fa-regular-400")["\uf0e0"]

Location icon: #text(font: "fa-regular-400")["\uf3c5"]

Phone icon: #text(font: "fa-regular-400")["\uf095"]

== Testing Solid Icons (fa-solid-900.ttf)

Email icon: #text(font: "fa-solid-900")["\uf0e0"]

Location icon: #text(font: "fa-solid-900")["\uf3c5"]

Phone icon: #text(font: "fa-solid-900")["\uf095"]

== Testing With Font Awesome Names

LinkedIn icon: #text(font: "Font Awesome 6 Brands")["\uf08c"]

Email icon: #text(font: "Font Awesome 6 Free")["\uf0e0"]

== Testing Multiple Font Fallbacks

LinkedIn icon: #text(font: ("fa-brands-400", "Font Awesome 6 Brands"))["\uf08c"]

GitHub icon: #text(font: ("fa-brands-400", "Font Awesome 6 Brands"))["\uf09b"]

Email icon: #text(font: ("fa-solid-900", "Font Awesome 6 Free Solid"))["\uf0e0"]

== Font Information

Available fonts:
#for font in text.fonts() [
  - #font
] 