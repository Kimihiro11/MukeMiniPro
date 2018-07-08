// pages/movies/movies.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var douApi = app.globalData.g_doubanBase;
    var douApiNums = "?start0&count=3";
    var inTheaterUrl = douApi + '/v2/movie/in_theaters' + douApiNums;
    var comingSoonUrl = douApi + '/v2/movie/coming_soon' + douApiNums;
    var top250Url = douApi + '/v2/movie/top250' + douApiNums;

    this.getMovieListData(inTheaterUrl,"inTheaters",'正在热映');
    this.getMovieListData(comingSoonUrl, "comingSoon", '即将上映');
    this.getMovieListData(top250Url, "top250", 'Top250');

  },

  getMovieListData: function (url, settedKey, categoryTitle){
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        that.processDoubanData(res.data,settedKey, categoryTitle);
      }
    })
  }, 

  processDoubanData:function(moviesDouban, settedKey, categoryTitle){
    var movies = [];
    //console.log(moviesDouban.subjects);
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
        stars:util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] ={
      movies:movies,
      categoryTitle:categoryTitle
      };
    this.setData(readyData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  }
})