<template>
    <div class="chatting-item other clearfix">
        <div class="msg-author">{{name}}</div>
        <div class="msg-from">
            <img class="head-img" :src="src" />
            <div class="msg-content"><img v-if="img" :src="img" class="img">{{msg}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name', 'src', 'msg', 'img']
    }

</script>

<style lang="less">
    @import "../../static/style/msg.less";
    .other {
        padding-left: 50px !important;
        .msg-author {
            font-size: 1rem;
        }
        .msg-from {
            justify-content: flex-start;
            .head-img {
                left: 5px;
            }
        }
        .msg-content {
            float: left;
            border-top-left-radius: 0 !important;
        }
    }
</style>