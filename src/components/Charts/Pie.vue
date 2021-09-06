<template>
  <div>
    <v-chart
    v-if="data.rows.length"
    :forceFit="true"
    :height="height"
    :padding="padding"
    :data="data"
    :scale="scale"
    :filter="filter"
    >
      <v-coord
        type="theta"
        :innerRadius=".75"
        :radius=".85"
      ></v-coord>
      <v-guide
:type="'text'"
:top="true"
:content="pieGuide.name"
:vStyle="guideStyle"
:position="['50%','45%']"
:offsetX="-20"></v-guide>
      <v-guide
:type="'text'"
:top="true"
:content="pieGuide.moneyTotal"
:vStyle="guideStyle2"
:position="['50%','55%']"
:offsetX="pieGuide.offsetX"></v-guide>
      <v-tooltip
        :showTitle="false"
        :containerTpl="containerTplTooltip"
        :itemTpl="itemTplTooltip"
      ></v-tooltip>
      <v-legend
        :useHtml="true"
        position="right"
        :reactive="true"
        :containerTpl="containerTplLegend"
        :itemTpl="itemTplLegend"
        :offset="offset"
      ></v-legend>
      <v-stack-interval
        position="percent"
        :color="color"
        :vStyle="style"
      ></v-stack-interval>
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'Pie',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    pieGuide: {
      type: Object,
      default: () => ({})
    },
    padding: {
      type: Array,
      default: () => ([50, 400, 50, 0])
    },
    height: {
      type: Number,
      default: () => (400)
    }
  },
  data () {
    return {
      offset: [15, 0],
      guideStyle: {
        fill: '#999',
        fontSize: '14'
      },
      guideStyle2: {
        fill: '#333',
        fontSize: '26'
      },
      scale: [
        {
          dataKey: 'percent',
          formatter: function formatter (val) {
            val = (val * 100).toFixed(2) + '%'
            return val
          },
          nice: false
        }
      ],
      filter: {
        dataKey: 'payType',
        callback: function (val) {
          return val !== 'UK'
        }
      },
      containerTplTooltip: '<div class="g2-tooltip"><ul class="g2-tooltip-list"></ul></div>',
      itemTplTooltip: '<li data-index={index}><span style="color:{color}">{name}:</span>{value}</li>',
      containerTplLegend: '<div class="g2-legend" style="top: 0;bottom: 0;display: flex;align-items: center;"> <table class="g2-legend-list"></table> </div>',
      color: [
        'payType',
        ['#3BA0FF', '#FAD337', '#4DCB73', '#36CBCB', '#F2637B', '#975FE4', '#448e4d', '#b7b83f', '#b9783f']
      ],
      style: {
        lineWidth: 2,
        stroke: '#fff'
      }
    }
  },
  methods: {
    itemTplLegend (value, color, checked, index) {
      const obj = this.data.rows[index]
      if (obj) {
        let percent = '0%'
        if (obj.percent > 0) {
          percent = (obj.percent * 100).toFixed(2) + '%'
        }
        checked = checked ? 'checked' : 'unChecked'
        return '<tr class="g2-legend-list-item item-' + index + ' ' + checked + '" data-value="' + value + '" data-color=' + color + ' >' + '<td style="width:120px;"><i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:' + color + ';"></i>' + '<span class="g2-legend-text" style="color: #666">' + value + '</span></td>' + '<td style="text-align: right;width:100px">' + percent + '</td>' + '<td style="text-align: right;color: #666;width:80px">￥' + obj.litres + '</td>' + '</tr>'
      }
    }
  }
}
</script>
