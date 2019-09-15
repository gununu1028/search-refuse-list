new Vue({
  el: '#main-application',
  vuetify: new Vuetify(),
  data: {
    area_list: null,
    filtered_area_list: null,
    modal_opened: false,
    selected_area_data: null,
    input_area_name: ''
  },
  mounted() {
    axios.get('https://script.google.com/macros/s/AKfycbyYMvoHo4may5LlbtEzZ2hRzN1OrAiRcYh59psPxrXLi-WNREgx/exec').then(
      (response) => {
        this.area_list = response.data
        this.filtered_area_list = response.data
      }
    );
  },
  methods: {
    select(area_data) {
      this.modal_opened = true;
      this.selected_area_data = area_data;
    },
    close() {
      this.modal_opened = false;
    },
    search() {
      this.filtered_area_list = this.area_list.filter(area_data => area_data.area_name.indexOf(this.input_area_name) != -1);
    }
  }
});
