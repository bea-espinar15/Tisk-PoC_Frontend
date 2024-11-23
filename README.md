# Tisk - Proof of Content
## Frontend App + Backend Authenticator and Orchestrator
*Last updated: 2024-11-23*

### Author
- Beatriz Espinar Aragón

### Branches structure
There are four types of branches:
- **main** ⭢ This is the main branch of the project and contains the stable, production-ready version. Only changes that have been tested and deemed stable are merged here.
- **dev** ⭢ This is the primary development branch where all new features are integrated and tested before being merged into main. An exhaustive process of testing is performed here to ensure that changes work correctly together.
- **feature** ⭢ These branches follow the structure *feature/\<feature-description\>* and are specific branches created to work on new functionalities or improvements. These branches are created from dev and, once completed, are merged back into dev.
- **hotfix** ⭢ These branches follow the structure *hotfix/\<issue-description\>* and are created to resolve specific bugs found in dev or critical issues directly in main.

### Naming convention
A series of conventions have been established to ensure the code follows a common standard:
#### Language
- All code, including comments, will be written in English.
- Routes will also be defined in English.
- The user interface of the application will be displayed in the language selected by the user in the settings, with the browser's preferred language as the default.
#### Files
Files will be named based on their type:
- Static resources (directory /public) will follow the **kebab-case** naming convention.
- Dynamic views (directory /views) will follow the **kebab-case** naming convention.
- JS files from the Node.js server will follow the **camelCase** naming convention.
#### Commits
The message of a commit must follow this structure: **\[\<Type\>\] \[\<Entity\>\] \<Description of the commit\>**, where \<Type\> can be one of the following:
- Feat (= Feature)
- Fix (= Hotfix)
- Ref (= Refactor)
- Doc (= Documentation)
- Misc (= Miscellaneous)

For example: "[Feat] [Task] EPs Create and Update"
#### CSS
When defining styles for a selector in CSS, attributes, if present, should be defined in the following order:
1. Display (display, flex-direction, align-items...)
2. Margin & Padding
3. Size (width, height, font-size...)
4. Border (border, border-radius...)
5. Color (color, background-color...)
6. Transitions
7. Others
#### HTML
- The ID of an HTML element will follow the format: \<element-type\>-\<description\>. For example, "div-task".
- When listing the classes of an HTML element, custom classes will be listed first, followed by Bootstrap classes in the order defined in the CSS section.
- The attributes in an HTML element should be defined in the following order:
    1. *id*
    2. Others:
        - \<input\>: name ⭢ type ⭢ hidden ⭢ placeholder ⭢ value ⭢ min ⭢ max
        - \<img\>: src ⭢ alt ⭢ width ⭢ height
        - \<a\>: href
    3. *class*
    4. *data* variables
#### JS
- Functions, methods and variables will follow the **camelCase** naming convention.
- Classes will be named following the **PascalCase** naming convention.
- Routes will follow the **kebab-case** naming convention.