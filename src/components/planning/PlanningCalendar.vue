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
                            {{'Starts: '}}{{promotionEvent.start }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-else>
                            {{'Not assigned'}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="promotionEvent.end">
                            {{'Ends: '}}{{promotionEvent.end }}
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
                                !event-more
                                :now="today"
                                :type="type"
                                @click:event="showEvent"
                                @click:more="viewDay"
                                @click:date="viewDay"
                                @click:time="addEvent"
                                @change="updateRange"
                                :weekdays="weekdays"
                                :locale="locale"
                        >
                            <template v-slot:interval="{ hour, minute}">
                                <span
                                        v-if="minute === new Date().getMinutes()"
                                >
                                    {{ hour + ':' + minute }} o'clock
                                </span>
                            </template>
                        </v-calendar>
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
                                        {{selectedEvent.start|formatDateTime}}
                                    </span>
                                    <br/>
                                    <span>
                                        <span class="text--primary">{{'Ends: '}}</span>
                                        {{selectedEvent.end|formatDateTime}}
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

<script>
    import {Component, Vue} from 'vue-property-decorator';
    import {IUser} from "@/models/User";

    export default {
        name: "PlanningCalendar",
        components: {},
        props: {
            subordinate: {
                type: Object
            },
            promotionStartDate: {
                type: String
            },
            promotionEndDate: {
                type: String
            },
        },
        data() {
            return {
                locale: 'en-UK',
                weekdays: [1, 2, 3, 4, 5, 6, 0],
                focus: '',
                type: 'month',
                typeToLabel: {
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                },
                start: null,
                end: null,
                selectedEvent: {},
                selectedElement: null,
                selectedOpen: false,
                events: [],
                colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
                names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],

                // promotion modal
                promotionEvent: {},
                promotionEventOpen: false,

                //  promotion time
                start_time_text: 'Starts: ',
                end_time_text: 'Ends: ',

                startTime: null,
                endTime: null,

                dialog: false,
                timepickerDialog1: false,
                timepickerDialog2: false,
                modal1: false,
                modal2: false,
            }
        },
        computed: {
            currentTime() {
                let a = new Date();
                return a.getHours() + ':' + a.getMinutes();
            },
            title() {
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
            },
            monthFormatter() {
                return this.$refs.calendar.getFormatter({
                    timeZone: 'UTC', month: 'long',
                })
            },
        },
        mounted() {
            this.$refs.calendar.checkChange()

            this.initEventFromData()
        },
        watch: {
            promotionEventOpen: function (val) {
                if (val) {
                    this.selectedOpen = false;
                }
            },
        },
        methods: {
            initEventFromData() {
                debugger
                if (this.promotionStartDate && this.promotionEndDate) {
                    //  use this method only for init promotion event
                    let e = {
                        id: 'PROMOTION_ID',
                        name: this.subordinate.name + '\'s promotion',
                        start: this.formatDate(this.promotionStartDate, -1),
                        end: this.formatDate(this.promotionEndDate, -1),
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                    }

                    this.startTime = new Date(this.promotionStartDate).getHours() + ':' + new Date(this.promotionStartDate).getMinutes()
                    this.endTime = new Date(this.promotionEndDate).getHours() + ':' + new Date(this.promotionEndDate).getMinutes()
                    this.events.push(e)
                }
            },
            savePromotionStartTime() {
                this.modal1 = false;
                this.promotionEvent.start = this.start.date + ' ' + this.startTime
                if (new Date(this.promotionEvent.start) > new Date(this.promotionEvent.end)) {
                    this.promotionEvent.start = this.promotionEvent.end
                    this.startTime = new Date(this.promotionEvent.end).getHours() + ':' + new Date(this.promotionEvent.end).getMinutes()
                    debugger
                } else if (new Date(this.promotionEvent.start) < new Date()) {
                    debugger
                    this.promotionEvent.start = new Date().toISOString().slice(0, 10)
                }
                this.$bus.$emit('promotionStartDate', this.promotionEvent.start)
                debugger
            },
            savePromotionEndTime() {
                this.modal2 = false;
                this.promotionEvent.end = this.start.date + ' ' + this.endTime
                if (new Date(this.promotionEvent.end) < new Date(this.promotionEvent.start)) {
                    this.promotionEvent.end = this.promotionEvent.start
                    this.endTime = new Date(this.promotionEvent.start).getHours() + ':' + new Date(this.promotionEvent.start).getMinutes()
                }
                this.$bus.$emit('promotionEndDate', this.promotionEvent.end)
                debugger
            },
            addEvent(eventTime) {
                this.$forceUpdate()
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
            },
            deletePromotionEvent() {
                this.events.pop()
                this.promotionEvent = {}
                this.promotionEventOpen = false
                this.startTime = null
                this.endTime = null
            },
            // showError() {
            //     const openError = () => {
            //         setTimeout(() => this.errorOpen = true, 10)
            //     }
            //     openError()
            //     if (this.errorOpen) {
            //         this.errorOpen = false
            //         setTimeout(openError, 10)
            //     }
            // },
            showEvent({nativeEvent, event}) {
                debugger
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target

                if (event.id && event.id === 'PROMOTION_ID') {
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

                nativeEvent.stopPropagation()
            },
            viewDay({date}) {
                this.focus = date
                this.type = 'day'
            },
            getEventColor(event) {
                return event.color
            },
            setToday() {
                this.focus = this.today
            },
            prev() {
                this.$refs.calendar.prev()
            },
            next() {
                this.$refs.calendar.next()
            },
            updateRange({start, end}) {

                const events = []

                const min = new Date(`${start.date}T00:00:00`)
                const max = new Date(`${end.date}T23:59:59`)
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
                this.start = start
                this.end = end
                this.events = events
            },
            nth(d) {
                return d > 3 && d < 21
                    ? 'th'
                    : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
            },
            rnd(a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a
            },
            formatDate(a, withTime) {
                return withTime
                    ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
                    : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
            },
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