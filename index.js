var shard = require('./shard.json');

shard.routes = [
  {
    path: '/apply',
    method: 'POST',
    respond: function (req, res, db) {
      var data = req.body;
      db.insert(data, 'applications', {}, function(err){
        if (err)
          res.status(500).send(err);
        else {
          res.status(201).send('OK');
        }
      });
    }
  },
  {
    path: '/admin',
    method: 'POST',
    respond: function (req, res, db) {
      if (! req.session.becadmin) {
        if (req.body.accesscode === 'HAILHUSTBAIDU32767')
          req.session.becadmin = true;
        else
          return res.status(403).send({err: 'Access Denied'});
      }
      var html = '';
      db.find({}, 'applications', {sort: {'_id': -1}}, function(err, docs){
        for (var i = 0; i < docs.length; i++) {
          html += '<div class="app-table"><h4 data-objid="' + docs[i]._id.toString() + '">' + docs[i]._id.toString() + ' <a href="javascript:void(0)" class="btn btn-danger remove-enrty"> 删除 </a></h4><table class="table table-condensed table-hover"><tr><td>姓名</td><td>性别</td><td>年级</td><td>专业</td><td>手机号码</td><td>QQ</td><td>电子邮箱</td><td>分组意向</td></tr><tr><td>'+docs[i].stu_name+'</td><td>'+docs[i].stu_gender+'</td><td>'+docs[i].stu_grade+'</td><td>'+docs[i].stu_major+'</td><td>'+docs[i].stu_cell+'</td><td>'+docs[i].stu_qq+'</td><td>'+docs[i].stu_email+'</td><td>'+docs[i].stu_target+'</td></tr><tr><td>个人简介</td><td colspan="7">'+docs[i].stu_intro+'</td></tr><tr><td>个人经历</td><td colspan="7">'+docs[i].stu_exp+'</td></tr><tr><td>预期目标</td><td colspan="7">'+docs[i].stu_expectation+'</td></tr></table></div>'
        }
        res.send({html: html});
      });
    }
  },
  {
    path: '/admin/manage',
    method: 'POST',
    respond: function (req, res, db) {
      if (! req.session.admin) {
        return res.status(403).send({err: 'Access Denied'});
      }
      db.remove({'_id' : new db.util.ObjectID(req.body.objid)}, 'applications', {},function(err){
        if (err)
          return res.status(500).send(err);
        else {
          res.status(202).send({'ok':true});
        }
      });
    }
  }
]
);

module.exports = shard;
