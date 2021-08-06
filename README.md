vdesTemplate


提交规范

提交格式
<type>(<scope>): <subject> (<issure>)

type

feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动

scope 选填 commit的影响范围， 如 template、parser、docs

subject 必填 commit的描述

issure 选填 issure的id值 如 (#1111)





```js
git commit -m 'feat(template): 增加 xxx 功能'
git commit -m 'bug(parse): 修复 xxx 功能'
```

