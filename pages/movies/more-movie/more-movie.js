// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');   
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle:'',
    movies:{},
    requestUrl:'',
    totalCount: 0,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    console.log(category)
    this.data.navigateTitle = category;
    var douApi = app.globalData.g_doubanBase;
    var dataUrl = '';
    switch(category){
      case '正在热映':
        dataUrl = douApi +'/v2/movie/in_theaters';
      break;
      case '即将上映':
        dataUrl = douApi + '/v2/movie/coming_soon';
        break;
      case 'Top250':
        dataUrl = douApi + '/v2/movie/top250';
        break;

    }
    this.data.requestUrl = dataUrl;
    util.httpGet(dataUrl, this.processDoubanData);
  },

  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount +'&count=20';
    util.httpGet(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl +'?start=0&count=20';
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.httpGet(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  // onReachBottom: function (event) {
  //   var nextUrl = this.data.requestUrl +
  //     "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    //console.log(moviesDouban.subjects);
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    var totalMovies = {};
   
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies:totalMovies
      });

    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success:function(res){
        
      }
    })
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
  
  }

 
})