import {chartNames} from './chartSetting'


export const scriptForChart = {
    [chartNames[0]]: `function (list) {
      var xData = [];
      var lendata=[];
    
      var data = {};
      var teams=[];
      
      var legend={}
      legend.type='scroll';
      legend.orient='vertical';
      legend.right=0;
      legend.top=20;
      legend.bottom=20;
      legend.data=[];
      var index=-1;
      for (var i=0;i <30;i++)
      {
          index=-1;    
          if (teams.indexOf(list[i]['次集团'])<0)
          {
              teams.push(list[i]['次集团']);
                  
          } 
      }
      legend.data.push('应到人数');
      legend.data.push('实到人数');
      legend.data.push('缺席人数');
      
      for(var p=0;p<legend.data.length; p++)
      {
          var item=legend.data[p];
          if (!data[item])
          {
              data[item]=new Array();
          }
          console.log(item);
          for (var t =0; t<teams.length;t++)
          {
              data[item][t]=0;
          }
      }
      
      console.log(data);
          for (var i = 0; i < 30; i++) {
            
              index=teams.indexOf(list[i]['次集团']);
              if (index>=0)
              {
                  data['应到人数'][index]=parseFloat(list[i]['应到人数']);
                  data['实到人数'][index]=parseFloat(list[i]['实到人数']);
                  data['缺席人数'][index]=parseFloat(list[i]['缺席人数']);
              }
              
              
          }
      
      var series = [];
      for (var key in data) {
          if (key !='缺席人数')
          {
          series.push({
              name: key,
              type: 'bar',
              label: {
                  normal: {
                      show: false,
                      position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
                      rich: {
                          name: {
                              textBorderColor: '#fff'
                            }
                          }
                    
                  }
              },
              data: data[key]
          });
          }
          else
          {
              series.push({
              name: key,
              type: 'bar',
              label: {
                  normal: {
                      show: false,
                      position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
                      rich: {
                          name: {
                              textBorderColor: '#fff'
                            }
                          }
                    
                  }
              },
              data: data[key],
              markLine : {
                  lineStyle: {
                      normal: {
                          type: 'dashed'
                      }
                  },
                  data : [
                      [{type : 'min'}, {type : 'max'}]
                  ]
              }
          });
          }
      }
      return [{
          style: {
            height: 600,
          },
          wrapperLayout: {
            lg: 24
          },
          grid: {
              left: 10,
              containLabel: true
          },
          calculable: true,
          title: { text: '各次集团出勤' ,x:"center"},
          tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }},
          xAxis: {
              type: 'category',
              axisTick: {show: false},
              data:teams
          },
          yAxis: {
              type: 'value'
          },
          legend:legend,
          toolbox: {
            show: true,
            orient: 'vertical',
            right: 20,
            top: 'center',
            feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar', 'stack']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
          dataZoom: [
            {
              startValue: legend.data[0],
            }, 
            {
              type: 'inside'
            }
          ],
          series: series
      }]
  }`,
    [chartNames[1]]: `
  function (list) {
    var xData = [];
    var lendata=[];
  
    var data1 = {};
    var data2={};
    var data3={};
    var teams={};
    
    var legend={};
    legend.type='scroll';
    legend.orient='vertical';
    legend.right=0;
    legend.top=20;
    legend.bottom=20;
    legend.data=[];
    var index=-1;
    var departments={};
    var subgroup=[];
    var yData=[];
    for (var i=0;i <30;i++){
      index=-1; 
      var keywords= list[i]['次集团'].toUpperCase(); 
      var departName=list[i]['部门'].toUpperCase(); 
      if (!teams[keywords]){
        teams[keywords]={};
        teams[keywords].deparments=[];
        teams[keywords].data1=[];   
        teams[keywords].data2=[];
        teams[keywords].data3=[];
        subgroup.push(keywords);
        
      } 
      if (teams[keywords].deparments.indexOf(departName)<0){
        teams[keywords].deparments.push(departName);
        teams[keywords].data1.push(parseFloat(list[i]['应到人数']));
        teams[keywords].data2.push(parseFloat(list[i]['实到人数']));
        teams[keywords].data3.push(parseFloat(list[i]['缺席人数']));
      }        
    }
    legend.data.push('应到人数');
    legend.data.push('实到人数');
    legend.data.push('缺席人数');
  
    var series = [];
    var options=[];
    series.push({
      name:'应到人数',
      type: 'bar'          
    });
    series.push({
        name:'实到人数',
        type: 'bar'          
    });
    series.push({
      name:'缺席人数',
      type: 'bar'          
    });
    var ids=0;
    for (var key in  teams) {
      options.push({
        title: {
          text: key+'次集团数据'
        },
        series:[
          {
            data: teams[key].data1
          },
          {
            data: teams[key].data2
          },
          {
            data: teams[key].data3,
            markLine: {
              lineStyle: {
                normal: {
                  type: 'dashed'
                }
              },
              data : [
                [
                  {type : 'min'}, 
                  {type : 'max'}
                ]
              ]
            }
          }
        ]          		
      });
      xData.push({
        type: 'category',
        axisTick: {show: false},
        data: teams[key].deparments
      });
    }
    yData.push( {
      type: 'value'
    });
  
    var returnOption = {
      events: {
        'timelinechanged': function({currentIndex: index}, echart){
          let option = echart.getOption();
          returnOption.baseOption.xAxis = [xData[index]];
          returnOption.baseOption.dataZoom = [
            {
              startValue: teams[subgroup[index]].deparments[0],
            }, 
            {
              type: 'inside'
            }
          ];
          echart.setOption(returnOption);
        }
      },     
      wrapperLayout: {
        lg: 24
      },
      style: {
        height: 600,
      },
      baseOption:{
        timeline: {
          axisType: 'category',
          data: subgroup
        },          
        xAxis:[xData[0]],
        yAxis: yData,
        series: series,
        grid: {
          bottom: 100
        },
        calculable: true,
        title: { text: '各次集团下部门出勤' ,x:"center"},
        tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        
        legend: legend,
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
      },
      dataZoom: [
        {
          startValue:teams[subgroup[0]].deparments[0],
          bottom: 50
        }, 
        {
          type: 'inside'
        }
      ],
    },
    options:options
  };
    return [returnOption];
  }`,
    [chartNames[2]]: ''
}
