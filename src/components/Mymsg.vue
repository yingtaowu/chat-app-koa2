<template>
    <div class="chatting-item self clearfix">
        <div class="msg-from">
            <div class="msg-content"><img v-if="img" :src="img" class="img">{{msg}}</div>
            <img class="head-img" :src="src" />
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name', 'img', 'msg', 'src']
    }

</script>

<style lang="less">
    @import "../../static/style/msg.less";
    .self {
        padding-right: 50px !important;
        .msg-from {
            justify-content: flex-end;
            .head-img {
                right: 5px;
            }
        }
        .msg-content {
            float: right;
            border-top-right-radius: 0 !important;
            margin-top: 15px !important;
        }
    }
</style>