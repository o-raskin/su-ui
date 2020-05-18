<template>
    <div>
        <v-dialog
                v-model="dialog"
                max-width="1000"
        >
            <template v-slot:activator="{ on }">
                <v-list-item two-line v-on="on">
                    <v-list-item-icon>
                        <v-icon class="mt-3">
                            mdi-calendar-multiple
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{'Promotion date: '}}
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="promotionEvent.start">
                            {{'Starts: '}} {{promotionEvent.start | formatDateTime}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-else>
                            {{'Not assigned'}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="promotionEvent.end">
                            {{'Ends: '}} {{promotionEvent.end | formatDateTime }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-row class="ma-0 fill-height text-center">
                <v-col>
                    <v-sheet height="64">
                        <v-toolbar flat color="white">
                            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                                Today
                            </v-btn>
                            <v-btn fab text small color="grey darken-2" @click="prev">
                                <v-icon small>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn fab text small color="grey darken-2" @click="next">
                                <v-icon small>mdi-chevron-right</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ title }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-menu bottom right>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            outlined
                                            color="grey darken-2"
                                            v-on="on"
                                    >
                                        <span>{{ typeToLabel[type] }}</span>
                                        <v-icon right>mdi-menu-down</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="type = 'day'">
                                        <v-list-item-title>Day</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="type = 'week'">
                                        <v-list-item-title>Week</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="type = 'month'">
                                        <v-list-item-title>Month</v-list-item-title>
                                    </v-list-item>
                                    <!--                                    <v-list-item @click="type = '4day'">-->
                                    <!--                                        <v-list-item-title>4 days</v-list-item-title>-->
                                    <!--                                    </v-list-item>-->
                                </v-list>
                            </v-menu>
                        </v-toolbar>
                    </v-sheet>
                    <v-sheet height="600">
                        <v-calendar
                                ref="calendar"
                                v-model="focus"
                                color="primary"
                                :events="events"
                                :event-color="getEventColor"
                                :now="today"
                                :type="type"
                                @click:event="showEvent"
                                @click:more="viewDay"
                                @click:date="viewDay"
                                @click:time="addEvent"
                                @change="updateRange"
                                :weekdays="weekdays"
                                :locale="locale"
                        ></v-calendar>
                        <v-menu
                                v-model="selectedOpen"
                                :close-on-content-click="false"
                                :activator="selectedElement"
                                offset-x
                        >
                            <v-card
                                    color="grey lighten-4"
                                    min-width="350px"
                                    flat
                            >
                                <v-toolbar
                                        :color="selectedEvent.color"
                                        dark
                                >
                                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <span>
                                        <span class="text--primary">{{'Starts: '}}</span>
                                        {{selectedEvent.start}}
                                    </span>
                                    <br/>
                                    <span>
                                        <span class="text--primary">{{'Ends: '}}</span>
                                        {{selectedEvent.end}}
                                    </span>
                                    <br/>
                                    <span v-html="selectedEvent.details"></span>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                            text
                                            color="secondary"
                                            @click="selectedOpen = false"
                                    >
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                        <v-menu
                                v-model="promotionEventOpen"
                                :close-on-content-click="false"
                                :activator="selectedElement"
                                offset-x
                                max-width="400px"
                        >
                            <v-card
                                    color="grey lighten-4"
                                    min-width="350px"
                                    flat
                            >
                                <v-toolbar
                                        :color="selectedEvent.color"
                                        dark
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                    <v-toolbar-title>
                                        {{selectedEvent.name}}
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-dialog
                                            v-model="modal1"
                                            persistent
                                            width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="startTime"
                                                    label="Starts: "
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="modal1"
                                                v-model="startTime"
                                                full-width
                                                :min="currentTime"
                                                :max="endTime"
                                        >
                                            <v-spacer/>
                                            <v-btn text color="primary" @click="savePromotionStartTime">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                    <v-dialog
                                            v-model="modal2"
                                            persistent
                                            width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="endTime"
                                                    label="Ends: "
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="modal2"
                                                v-model="endTime"
                                                full-width
                                                :min="startTime"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="savePromotionEndTime">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                    <br/>
                                    <span v-html="selectedEvent.details"></span>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                            dark
                                            color="red"
                                            @click="deletePromotionEvent"
                                    >
                                        Delete
                                    </v-btn>
                                    <v-btn
                                            dark
                                            color="green"
                                            @click="promotionEventOpen = false"
                                    >
                                        OK
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
    import {IUser, User} from "@/models/User";
    import {VCalendar} from "vuetify/lib";
    import {IPromotion, Promotion} from "@/models/Promotion";
    import {IEvent} from "@/models/Event";

    @Component({
        components: {},
    })
    export default class PlanningCalendar extends Vue {

        $refs!: {
            // @ts-ignore
            calendar: VCalendar
        }

        @Prop()
        public subordinate!: IUser;

        @Prop()
        public promotion!: IPromotion

        @Watch("promotion")
        public watchPromotionStartDate(newVal: IPromotion, oldVal: any) {
            if (newVal.id) {
                this.initEventFromData()
            }
            if (newVal.status === 'NOT CREATED') {
                this.clearData()
            }
        }

        @Watch("promotionEventOpen")
        public watchPromotionEventOpen(val: any, old: any) {
            if (val) {
                this.selectedOpen = false;
            }
        }

        @Prop()
        public eventsData!: IEvent[];

        @Watch("eventsData")
        public watchReceivedEventsData(val: IEvent[], old: any) {
            if (val && val.length > 0) {
                // this.events = val.map(data => this.generateEvent(data));
            }
        }


        public promotionEventOpen: boolean = false;
        public start: any = null;
        public end: any = null;
        public selectedElement: any = null;
        public events: any[] = [];
        public locale: string = 'en-UK';
        public promotionEvent: any = {};
        public selectedEvent: any = {};
        public selectedOpen: boolean = false;
        public startTime: any = null;
        public endTime: any = null;
        public dialog: boolean = false;
        public timepickerDialog1: boolean = false;
        public timepickerDialog2: boolean = false;
        public modal1: boolean = false;
        public modal2: boolean = false;
        public colors: any[] = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];
        public focus: any = '';
        public type: string = 'month';
        public today: any = new Date().toISOString().slice(0, 10);

        data() {
            return {
                weekdays: [1, 2, 3, 4, 5, 6, 0],
                typeToLabel: {
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                },
                names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
                start_time_text: 'Starts: ',
                end_time_text: 'Ends: ',
            }
        }

        get currentTime() {
            let a = new Date();
            return a.getHours() + ':' + a.getMinutes();
        }

        get title() {
            const {start, end} = this
            if (!start || !end) {
                return ''
            }

            const startMonth = this.monthFormatter(start)
            const endMonth = this.monthFormatter(end)
            const suffixMonth = startMonth === endMonth ? '' : endMonth

            const startYear = start.year
            const endYear = end.year
            const suffixYear = startYear === endYear ? '' : endYear

            const startDay = start.day + this.nth(start.day)
            const endDay = end.day + this.nth(end.day)

            switch (this.type) {
                case 'month':
                    return `${startMonth} ${startYear}`
                case 'week':
                case '4day':
                    return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
                case 'day':
                    return `${startMonth} ${startDay} ${startYear}`
            }
            return ''
        }

        get monthFormatter() {
            return this.$refs.calendar.getFormatter({
                timeZone: 'UTC', month: 'long',
            })
        }

        mounted() {
            // this.$refs.calendar.checkChange()
            this.initEventFromData()
        }

        public clearData() {
            this.start = null
            this.end = null
            this.startTime = null
            this.endTime = null
            this.dialog = false
            this.timepickerDialog1 = false
            this.timepickerDialog2 = false
            this.modal1 = false
            this.modal2 = false
            this.promotionEvent.end = null
            this.promotionEvent.start = null
            this.promotionEvent.name = null
            let pIndex = this.events.findIndex(e => e.id === 'PROMOTION_ID')
            if(pIndex !== -1) {
                this.events.slice(pIndex, 1);
            }
            this.promotionEventOpen = false
        }

        public initEventFromData() {
            if (this.promotion && this.promotion.startDate && this.promotion.endDate) {
                //  use this method only for init promotion event
                let e = {
                    id: 'PROMOTION_ID',
                    name: this.subordinate.name + '\'s promotion',
                    start: this.formatDate(new Date(this.promotion.startDate), -1),
                    end: this.formatDate(new Date(this.promotion.endDate), -1),
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                }
                this.promotionEvent = e;
                this.startTime = new Date(this.promotion.startDate).getHours() + ':' + new Date(this.promotion.startDate).getMinutes()
                this.endTime = new Date(this.promotion.endDate).getHours() + ':' + new Date(this.promotion.endDate).getMinutes()
                this.events.pop();
                this.events.push(e)
            }
        }

        public savePromotionStartTime() {
            this.modal1 = false;
            this.promotionEvent.start = this.start.date + ' ' + this.startTime
            if (new Date(this.promotionEvent.start) > new Date(this.promotionEvent.end)) {
                this.promotionEvent.start = this.promotionEvent.end
                this.startTime = new Date(this.promotionEvent.end).getHours() + ':' + new Date(this.promotionEvent.end).getMinutes()
            } else if (new Date(this.promotionEvent.start) < new Date()) {
                this.promotionEvent.start = new Date().toISOString().slice(0, 10)
            }
            this.$bus.$emit('promotionStartDate', this.promotionEvent.start)
        }

        public savePromotionEndTime() {
            this.modal2 = false;
            this.promotionEvent.end = this.start.date + ' ' + this.endTime
            if (new Date(this.promotionEvent.end) < new Date(this.promotionEvent.start)) {
                this.promotionEvent.end = this.promotionEvent.start
                this.endTime = new Date(this.promotionEvent.start).getHours() + ':' + new Date(this.promotionEvent.start).getMinutes()
            }
            this.$bus.$emit('promotionEndDate', this.promotionEvent.end)
        }

        public addEvent(eventTime : any) {
            let eventDateTime = new Date(eventTime.date + ' ' + eventTime.time)
            let currentDateTime = new Date()
            if (eventDateTime < currentDateTime) {
                this.$bus.$emit('status', {text: 'Cannot not set event in past', color: 'error'})
                return
            }

            //  removing old if it exists
            if (this.promotionEvent.id === 'PROMOTION_ID') {
                this.deletePromotionEvent()
            }

            let e = {
                id: 'PROMOTION_ID',
                name: this.subordinate.name + '\'s promotion',
                start: this.formatDate(new Date(eventTime.date + ' ' + eventTime.time), -1),
                end: this.formatDate(new Date(eventTime.date + ' ' + eventTime.time), -1),
                color: this.colors[this.rnd(0, this.colors.length - 1)],
            }

            this.events.push(e)
            this.promotionEvent = e;
            this.startTime = eventTime.time
            this.endTime = eventTime.time
            this.$bus.$emit('promotionStartDate', eventTime.date + ' ' + eventTime.time)
            this.$bus.$emit('promotionEndDate', eventTime.date + ' ' + eventTime.time)
        }

        public deletePromotionEvent() {
            this.events.pop()
            this.promotionEvent = {}
            this.promotionEventOpen = false
            this.startTime = null
            this.endTime = null
        }

        public showEvent(val : any) {
            this.selectedEvent = val.event
            this.selectedElement = val.nativeEvent.target

            if (val.event.id && val.event.id === 'PROMOTION_ID') {
                const openPromotionMenu = () => {
                    setTimeout(() => this.promotionEventOpen = true, 10)
                }

                openPromotionMenu()
                if (this.promotionEventOpen) {
                    this.promotionEventOpen = false
                    setTimeout(openPromotionMenu, 10)
                }
            } else {
                const open = () => {
                    setTimeout(() => this.selectedOpen = true, 10)
                }

                open()
                if (this.selectedOpen) {
                    this.selectedOpen = false
                    setTimeout(open, 10)
                }
            }
            val.nativeEvent.stopPropagation()
        }

        public viewDay(val : any) {
            this.focus = val.date
            this.type = 'day'
        }

        public getEventColor(event : any) {
            return event.color
        }

        public setToday() {
            this.focus = this.today
        }

        public prev() {
            this.$refs.calendar.prev()
        }

        public next() {
            this.$refs.calendar.next()
        }

        public updateRange(val : any) {

            const events = []

            const min = new Date(`${val.start.date}T00:00:00`)
            const max = new Date(`${val.end.date}T23:59:59`)
            const days = (max.getTime() - min.getTime()) / 86400000

            const eventCount = this.rnd(days, days + 20)
            // for (let i = 0; i < eventCount; i++) {
            //     const allDay = this.rnd(0, 3) === 0
            //     const firstTimestamp = this.rnd(min.getTime(), max.getTime())
            //     const first = new Date(firstTimestamp - (firstTimestamp % 900000))
            //     const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
            //     const second = new Date(first.getTime() + secondTimestamp)
            //
            //     let generatedEvent = {
            //         name: this.names[this.rnd(0, this.names.length - 1)],
            //         start: this.formatDate(first, !allDay),
            //         end: this.formatDate(second, !allDay),
            //         color: this.colors[this.rnd(0, this.colors.length - 1)],
            //     }
            //     // debugger
            //     events.push(generatedEvent)
            // }

            if (this.promotionEvent.id &&
                this.promotionEvent.id === 'PROMOTION_ID' &&
                this.events.findIndex(e => e.id === 'PROMOTION_ID') === -1) {
                events.push(this.promotionEvent)
            }

            this.$forceUpdate()
            this.start = val.start
            this.end = val.end
            this.events = events
        }

        public nth(d : any) {
            return d > 3 && d < 21
                ? 'th'
                : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
        }

        public rnd(a : any, b : any) {
            return Math.floor((b - a + 1) * Math.random()) + a
        }

        public formatDate(a : any, withTime : any) {
            return withTime
                ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
                : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
        }
    }
</script>

<style scoped>
    .past-day {
        position: absolute;
        opacity: 0.55;
        top: 40px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        z-index: 0;
    }
</style>