// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    //console.log(postId)
    //console.log(postsData)
    this.data.currentPostId = postId;
    var postData = postsData.postsList[postId];
    this.setData({
      postDataKey: postData
    });

    var postsCollected = wx.getStorageSync('posts_Collected');
    // console.log(postsCollected)
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected);
    }
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    var that = this;
    backgroundAudioManager.onPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
    });
    backgroundAudioManager.onPause(function(){
      that.setData({
        isPlayingMusic: false
      })
    });
    // wx.onBackgroundAudioPlay(function(){
    //   that.setData({
    //     isPlayingMusic: true
    //   })
    // })
    // wx.onBackgroundAudioPause(function(){
    //   that.setData({
    //     isPlayingMusic: false
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    //是否收藏切换  
    postCollected = !postCollected;
    //console.log(this.data.currentPostId);
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_Collected', postsCollected)
    //更新数据绑定变量,从而实现切换图片
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
    })
  },

  onShareTap: function(event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消？' + res.cancel + '测试',
        })
      }
    })
  },

  onMusicTap: function(event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postsList
    //console.log(postsData)
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlayingMusic) {
      backgroundAudioManager.pause();
      this.setData({
        isPlayingMusic: false
      })
   
    } else {
      backgroundAudioManager.play();
   
      backgroundAudioManager.src = postData[currentPostId].music.src;
      backgroundAudioManager.title = postData[currentPostId].music.title;
      backgroundAudioManager.coverImgUrl = postData[currentPostId].music.coverImgUrl;
;
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})
