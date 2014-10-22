//
// ===========================================================【程式資訊及版權宣告】====
//  ExoBUD MP(II) v4.1tc+ [Traditional Chinese Version]
//  Copyright(Pe) 1999-2003 Jinwoong Yu[ExoBUD], Kendrick Wong[kiddiken.net].
// =====================================================================================
//  程式原作者: 庾珍雄(Jinwoong Yu)         繁體中文化作者: 驚直(Kendrick Wong/kiddiken)
//    個人網站: http://exobud.nayana.org          個人網站: http://kiddiken.net
//    電子郵件: exobud@hanmail.net                電子郵件: webmaster@kiddiken.net
//    ICQ 帳號: 96138429                          MSN 帳號: kiddiken@msn.com
//    發表日期: 2003.01.10(此版本原韓文版)        發表日期: 2003.03.23(繁體中文首個版本)
// =====================================================================================
//
//    版權所有。
//    請尊重智慧財產權： 無論您對本程式 ExoBUD MP(II) 作任何修改、製作(或翻譯)面板，請您
//    *必須*保留此段版權宣告的內容，包括程式(及面板)原作者及中文化作者的名字和網站連結。
//
//    如果您想要以這個繁體中文版的程式為基礎，翻譯成其他語言的版本，及／或在網際網路上，
//    公開發表您所修改過的版本，請您首先以傳送電子郵件的方式，徵求我們的同意。
//
//    請不要將程式(或面板)原作者或中文化作者的名字改成您自己的名字，
//    然後以另一程式名稱重新命名後在網路上公開發表及散播本程式，因為這是嚴重的侵權行為。
//
//    這是公益免費程式，所以請不要使用在商業用途上。
//    另外，您亦不可將本程式(全部或部份)複製到其他儲存媒體(例如光碟片)上作販賣獲利用途。
//
//    假如因為使用本程式而令您蒙受資料遺失或損毀，程式原作者及中文化作者均不用對其負責。
//
// =====================================================================================

// 當您修改本程式的原始碼時，請注意執行修改後的程式，可能會導致一些正在執行中的應用程式
// 無法正常運作；另外亦要留意在JavaScript上所使用的變數名稱和設定值，大小寫是有分別的。
function MusicObject(url, title) {
    this.url = url;
    this.title = title;
}
var jplayer = new function () {
    this.controls = new function() {
        this.play = function() {
            $("#Exobud").jPlayer("play");
            jplayer.config.play_state = 3;
            tidMsg = setTimeout('rtnTLab()', 1000);
        }

        this.stop = function() {
            $("#Exobud").jPlayer("stop");
            jplayer.config.play_state = 1;
            tidMsg = setTimeout('rtnTLab()', 1000);
        }

        this.pause = function() {
            $("#Exobud").jPlayer("pause");
            jplayer.config.play_state = 2;
            tidMsg = setTimeout('rtnTLab()', 1000);
        }
        this.getCurrentPositionTime = function() {
            return $('#Exobud').data('jPlayer').status.currentTime;
        }
        this.getCurrentPositionTimeString = function() {
            return $.jPlayer.convertTime(jplayer.controls.getCurrentPositionTime());
        }
        this.getDurationTime = function() {
            return $('#Exobud').data('jPlayer').status.duration;
        }
        this.getDurationTimeString = function() {
            return $.jPlayer.convertTime(jplayer.controls.getDurationTime());
        }
    }
    this.error = function(e)
    {
       console.log(e);
       playNext();
    }

    this.config = new function (){
        this.auto_play = true;
        this.play_state = 1;
        this.open_state = 0;
        this.time_elapse_mode = true;
        this.next_delay_time = 200;
        this.mute = false;
        this.volume = 20;
    }
}

var cActIdx = 0;

var blnRept = false;

var playlist = new function () {
    this.index = 0;
    this.length = 0;
    this.list = new Array();
    this.index_list = new Array();
    this.addMusic = function (musicObject)
    {
       this.list[this.length] = musicObject;
       this.index_list[this.length]=this.length;
       this.length++;
    }
};

function jPlayerInit() {
    $("#Exobud").bind($.jPlayer.event.error, function(event) { // Using ".myProject" namespace
        switch (event.jPlayer.error.type) {
            case $.jPlayer.error.URL:
                jplayer.error(event); // A function you might create to move on to the next media item when an error occurs.
                break;
        }
    });
}


function mkList(url, title ) {
    playlist.addMusic(new MusicObject(url,title));
}


// initExobud() 函式: 初始化 ExoBUD MP(II) 媒體播放程式
function initExobud() {
    jPlayerInit();

    if (!blnShowVolCtrl) {
        document.images['vmute'].style.display = "none";
        document.images['vdn'].style.display = "none";
        document.images['vup'].style.display = "none";
    }

    if (blnRept) {
        imgChange('rept', 1);
    } else {
        imgChange('rept', 0);
    }

    if (blnRndPlay) {
        imgChange('pmode', 1);
    } else {
        imgChange('pmode', 0);
    }
    showTLab();
    disp1.innerHTML = "ExoBUD MP(II) v4.1tc+ 網站媒體播放程式";
    if (blnStatusBar) {
        window.status = ('ExoBUD MP(II) v4.1tc+ 網站媒體播放程式');
    }
    if (blnAutoStart) {
        startExobud();
    }
}

// startExobud() 函式: 開始播放曲目
function startExobud() {
    var play_state = jplayer.config.play_state;
    if (play_state == 2) {
        jplayer.controls.play();
        return;
    }
    if (play_state == 3) {
        return;
    }

    if (blnRndPlay) {
        randPlayList();
    }
    jPlayerPlayByIndex(playlist.index_list[0]);
}
var cActIdx;

// selMmPlay() 函式: 處理媒體標題
function jPlayerPlayByIndex(idx) {
    var trknum = idx + 1;
    var ctit = playlist.list[idx].title;
    if (ctit == ""|ctit == null) {
        ctit = "(沒有媒體標題)";
    }

    var url = playlist.list[idx].url;
    $("#Exobud").jPlayer("destroy");
    jplayer.config.play_state = 1;
    $("#Exobud").jPlayer({
        ready: function(event) {
            $(this).jPlayer("setMedia", {
                mp3: url,
                wma: url,

            });
        },
        swfPath: "http://jplayer.org/latest/js",
        supplied: "mp3",
        ended: function() {
            jplayer.config.play_state = 1;
            playAuto();
        }
    });
    $("#Exobud").jPlayer("load");
    cActTit = "T" + trknum + ". " + ctit;
    disp1.innerHTML = cActTit;
    if (blnStatusBar) {
        window.status = (cActTit);
    }
    setTimeout('rtnTLab()', 500);
    setTimeout('jplayer.controls.play()', 1000);
}

// wmpPlay() 函式: 使用 wmp-obj v7.x 程式庫播放曲目
function jplayerPlay() {
    jplayer.controls.play();
}

// wmpStop() 函式: 停止播放曲目及顯示「就緒」狀態訊息
function jplayerStop() {
    clearInterval(tidTLab);
    imgChange("stopt", 1);
    imgChange("pauzt", 0);
    imgChange("scope", 0);
    showTLab();
    jplayer.controls.stop();
    disp1.innerHTML = "ExoBUD MP(II) v4.1tc+ 網站媒體播放程式 [就緒]";
    if (blnStatusBar) {
        window.status = ('ExoBUD MP(II) v4.1tc+ 網站媒體播放程式 [就緒]');
        return true;
    }
}

// wmpPause() 函式: 使用 wmp-obj v7.x 程式庫暫停播放曲目
function jplayerPause() {
    jplayer.controls.pause();
}


function sortPlayList() {
    for (var index = 0 ; index < playlist.length ; index++)    
    {
       playlist.index_list[index] = index;
    }
}
function randPlayList() {
    for (var index = 0 ; index < playlist.length ; index++)    
    {
       var rand_index =  Math.floor(Math.random() * (playlist.length-index) ) + index; 

       var tmp = playlist.index_list[index];
       playlist.index_list[index] = playlist.index_list[rand_index] ;
       playlist.index_list[rand_index] = tmp;
    }
}

// playAuto() 函式: 對已啟用播放項目進行「自動連續播放」的處理
// 這是根據上面 blnAutoProc 的設定值而決定的動作。
function playAuto() {

    if (blnRept) {
        jPlayerPlayByIndex(cActIdx);
        return;
    }
    if (blnRndPlay) {
        randPlayList();
    }
    jPlayerPlayByIndex(playlist.index_list[0]);
}

// playPrev() 函式: 播放上一首已啟用播放項目
function playPrev() {
    var play_state = jplayer.config.play_state;
    if (play_state == 2 || play_state == 3) {
        jplayer.controls.stop();
    }

    cActIdx--;
    if (cActIdx < 0) {
        cActIdx = playlist.length - 1;
    }
    jPlayerPlayByIndex(playlist.index_list[cActIdx]);
}

// playNext() 函式: 播放下一首已啟用播放項目
function playNext() {
    var play_state = jplayer.config.play_state;
    if (play_state == 2 || play_state == 3) {
        jplayer.controls.stop();
    }

    cActIdx++;
    if (cActIdx >= playlist.length) {
        cActIdx = 0;
    }
    jPlayerPlayByIndex(playlist.index_list[cActIdx]);
}

// retryPlay() 函式: 再次嘗試連線到媒體檔案
function retryPlay() {
    jPlayerPlayByIndex(cActIdx);
}

// chkRept() 函式: 切換是否重複播放目前的曲目(已啟用播放項目)
function chkRept() {
    var play_state = jplayer.config.play_state;
    if (play_state == 3) {
        clearInterval(tidTLab);
    }
    if (blnRept) {
        blnRept = false;
        imgChange('rept', 0);
        disp2.innerHTML = "不重複播放";
    } else {
        blnRept = true;
        imgChange('rept', 1);
        disp2.innerHTML = "重複播放";
    }
    tidMsg = setTimeout('rtnTLab()', 500);
}

// chgPMode() 函式: 切換以循序(Sequential)抑或隨機(Random)的方式來播放媒體項目
function chgPMode() {
    var play_state = jplayer.config.play_state;
    if (play_state == 3) {
        clearInterval(tidTLab);
    }
    if (blnRndPlay) {
        blnRndPlay = false;
        imgChange('pmode', 0);
        sortPlayList();
        disp2.innerHTML = "循序播放";
    } else {
        blnRndPlay = true;
        imgChange('pmode', 1);
        randPlayList();
        disp2.innerHTML = "隨機播放";
    }
    tidMsg = setTimeout('rtnTLab()', 500);
}


// evtPSChg() 函式: 切換播放程式的動作
function evtPSChg(f) {
    //   以下是狀態值 (f) 的說明:
    //    0(未定義)       1(已停止播放)   2(已暫停播放)   3(正在播放中)   4(向前搜索)     5(向後搜索)
    //    6(緩衝處理中)   7(等待中)       8(已播放完畢)   9(轉換曲目中)  10(就緒狀態)

    switch (f) {
        case 1:
            evtStop();
            break;
        case 2:
            evtPause();
            break;
        case 3:
            evtPlay();
            break;
        case 8:
            setTimeout('playAuto()', intDelay);
            break;
    }
}



// evtStop() 函式: 停止播放
function evtStop() {
    clearInterval(tidTLab);
    showTLab();
    imgChange("pauzt", 0);
    imgChange("playt", 0);
    imgChange("scope", 0);
    disp1.innerHTML = "ExoBUD MP(II) v4.1tc+ [等待播放下一首曲目]";
    if (blnStatusBar) {
        window.status = ('ExoBUD MP(II) v4.1tc+ [等待播放下一首曲目]');
        return true;
    }
}

// evtPause() 函式: 暫停播放
function evtPause() {
    imgChange("pauzt", 1)
    imgChange("playt", 0);
    imgChange("stopt", 0);
    imgChange("scope", 0);
    clearInterval(tidTLab);
    showTLab();
}

// evtPlay() 函式: 開始播放
function evtPlay() {
    imgChange("pauzt", 0)
    imgChange("playt", 1);
    imgChange("stopt", 0);
    imgChange("scope", 1);
    tidTLab = setInterval('showTLab()', 1000);
}

// showTLab() 函式: 顯示時間長度
function showTLab() {
    var play_state = jplayer.config.play_state;
    if (play_state == 2 || play_state == 3) {
        var current_position_time = jplayer.controls.getCurrentPositionTime();
        var current_position_time_string = jplayer.controls.getCurrentPositionTimeString();
        var durationd_time = jplayer.controls.getDurationTime();
        var durationd_time_string = jplayer.controls.getDurationTimeString();
        if (jplayer.config.time_elapse_mode) {
            disp2.innerHTML = current_position_time_string + " | " + durationd_time_string;
            var msg = cActTit + " (" + current_position_time_string + " | " + durationd_time_string + ")";
            if (play_state == 2) {
                msg = "(暫停) " + msg;
            }
            if (blnStatusBar) {
                window.status = (msg);
                return true;
            }
        } else {
            var laps = durationd_time - current_position_time;
            var strLaps = wmpTime(laps);
            disp2.innerHTML = strLaps + " | " + durationd_time_string;
            var msg = cActTit + " (" + strLaps + " | " + durationd_time_string + ")";
            if (play_state == 2) {
                msg = "(暫停) " + msg;
            }
            if (blnStatusBar) {
                window.status = (msg);
                return true;
            }
        }

    } else {
        disp2.innerHTML = "00:00 | 00:00";
    }
}

// chgTimeFmt() 函式: 變更時間長度的顯示方式
function chgTimeFmt() {
    var wmps = jplayer.config.play_state;
    if (wmps == 3) {
        clearInterval(tidTLab);
    }
    if (jplayer.config.time_elapse_mode) {
        jplayer.config.time_elapse_mode = false;
        disp2.innerHTML = "倒數方式";
    } else {
        jplayer.config.time_elapse_mode = true;
        disp2.innerHTML = "正常方式";
    }
    tidMsg = setTimeout('rtnTLab()', 500);
}

// rtnTLab() 函式: 傳回時間長度
function rtnTLab() {
    var wmps = jplayer.config.play_state;
    if (wmps == 3) {
        tidTLab = setInterval('showTLab()', 1000);
    } else {
        showTLab();
    }
    $("#Exobud").jPlayer("volume", jplayer.config.volume / 100.0);
    $("#Exobud").jPlayer("mute", jplayer.config.mute);
}

// wmpTime() 函式: 計算時間長度
function wmpTime(dur) {
    var hh, min, sec, timeLabel;
    hh = Math.floor(dur / 3600);
    min = Math.floor(dur / 60) % 60;
    sec = Math.floor(dur % 60);
    if (isNaN(min)) {
        return "00:00";
    }
    if (isNaN(hh) || hh == 0) {
        timeLabel = "";
    } else {
        if (hh > 9) {
            timeLabel = hh.toString() + ":";
        } else {
            timeLabel = "0" + hh.toString() + ":";
        }
    }
    if (min > 9) {
        timeLabel = timeLabel + min.toString() + ":";
    } else {
        timeLabel = timeLabel + "0" + min.toString() + ":";
    }
    if (sec > 9) {
        timeLabel = timeLabel + sec.toString();
    } else {
        timeLabel = timeLabel + "0" + sec.toString();
    }
    return timeLabel;
}

// wmpVolUp(), wmpVolDn(), wmpMute() 這幾個都是用來調校音量的函式。(單位：％)
// vmax 代表最大音量(100), vmin 代表最小音量(0), vdep 代表調校音量的間隔(建議設為5至20之間)
// 您只可以在 vmin, vmax, vdep 設為0至100之間的整數數值，vmin 和 vdep 數值不可以大過 vmax。

var vmax = 100;
var vmin = 0;
var vdep = 10;

// wmpVolUp() 函式: 增加音量(Volume Up)
function jplayerVolUp() {
    var wmps = jplayer.config.play_state;
    if (wmps == 3) {
        clearInterval(tidTLab);
    }
    var ps = jplayer.config;
    if (ps.mute) {
        ps.mute = false;
        disp2.innerHTML = "音量恢復";
        imgChange('vmute', 0);
    } else {
        if (ps.volume >= (vmax - vdep)) {
            ps.volume = vmax;
        } else {
            ps.volume = ps.volume + vdep;
        }
        disp2.innerHTML = "音量: " + ps.volume + "%";
    }

    tidMsg = setTimeout('rtnTLab()', 500);
}

// wmpVolDn() 函式: 減少音量(Volume Down)
function jplayerVolDn() {
    var wmps = jplayer.config.play_state;
    if (wmps == 3) {
        clearInterval(tidTLab);
    }
    var ps = jplayer.config;
    if (ps.mute) {
        ps.mute = false;
        disp2.innerHTML = "音量恢復";
        imgChange('vmute', 0);
    } else {
        if (ps.volume <= vdep) {
            ps.volume = vmin;
        } else {
            ps.volume = ps.volume - vdep;
        }
        disp2.innerHTML = "音量: " + ps.volume + "%";
    }
    tidMsg = setTimeout('rtnTLab()', 500);
}

// wmpMute() 函式: 靜音模式(Mute)
function jplayerMute() {
    var wmps = jplayer.config.play_state;
    if (wmps == 3) {
        clearInterval(tidTLab);
    }
    var ps = jplayer.config;
    if (!ps.mute) {
        ps.mute = true;
        disp2.innerHTML = "開啟靜音模式";
        imgChange("vmute", 1);
    } else {
        ps.mute = false;
        disp2.innerHTML = "關閉靜音模式";
        imgChange("vmute", 0);
    }
    tidMsg = setTimeout('rtnTLab()', 500);
}

