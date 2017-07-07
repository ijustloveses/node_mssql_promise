### install node & npm & mssql
```
cd w2v/npm  (~/tools/npm on my pc)

yum install -y gcc-c++ make

curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash -

yum install nodejs
node -v
npm -v

npm install mssql -g
```

### reference

- [mssql](https://www.npmjs.com/package/mssql)
- [promise book](https://coderwall.com/p/ijy61g/promise-chains-with-node-js)

### 我的尝试

首先先说一个，mssql 没有给完整例子，我按其例子写程序时，最后都 block 在主线程了。经调试，发现必须要 pool.close() 才行

而由于是异步多个协程来处理多个表，那么需要找一个合适的点来调用 pool.close()，于是事情就变得有趣起来

1. 首先按照 reference 写了下 async / await 的方式，好处是可以类似同步的样子写异步的程序
    但是，在我的环境中，一直无法通过测试。由于时间有限，故此未深究，放弃

2. 然后试了下 callback 的方式，没有问题，但是对于导多个表的情况，写起来比较繁琐，回调链太长

3. 然后试了下多个表同时异步处理，然后使用 promise.all 的方式同步等待所有 promises 处理完，再 pool.close()
    这个看起来很舒服，代码很顺眼，逻辑也清晰，不过运行的时候 coredump 了.... 未深究，放弃

4. 使用普通的 promise 方式，多个表不再同时异步处理，而是链式的一个处理完了再处理下一个。
    但是写成 promise 链的话，也比较难看，因为要处理成功(resolve) 和失败(reject) 的情况，故此会形成一个大嵌套
    解决方案是我写了个 recursive_promise，递归的方式处理数据表列表，顺眼多了！
