#!/usr/bin/perl

use FindBin;
use lib "$FindBin::Bin/extlib";
use CGI;
use JSON;
use Encode;
use File::Basename 'fileparse';

# Debug用
use Data::Dumper;

$CGI::POST_MAX = 1024 * 1024; # 1MB

my $cgi = CGI->new();
my $mtd = $cgi->request_method();
#$mtd = "OPTIONS";
if ($mtd eq "OPTIONS") {
    print $cgi->header(
                -content_type => 'text/plain',
                -access_control_allow_origin => "*",
                -access_control_allow_headers => "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
                -access_control_allow_methods => "GET, POST, HEAD, OPTIONS",
                -access_control_max_age => 3600 );
    print "Preflight Request\n";
    exit;
}
my $json  = JSON->new->utf8(1);
my $resp;

my $controller;
my $action;

## スクリプトの実行パスを取得する
my ($script_name, $script_path) = File::Basename::fileparse $0;
## dataディレクトリのパスを取得する
my $data_path = $script_path . "/data";

## エラー終了する
sub errorExit {
    my $message = shift(@_);
    my $code = shift(@_);

    $resp = {
            code  => $code,
            messaage => $message
    };
    print $cgi->header({type=>'application/json', charset=>'utf-8',-access_control_allow_origin => "*"});
    print $json->encode($resp);
    exit;
}

## 正常終了
sub successExit {
    my $result = shift(@_);

    $resp = {
            code  => 0,
            result => $result,
    };
    print $cgi->header({type=>'application/json', charset=>'utf-8',-access_control_allow_origin => "*"});
    print $json->encode($resp);
    exit;
}

## ファイルの中身を取得する
sub file_get_contents {
    my $filename = shift(@_);
    my $line = "";
    open(FP,$filename) || errorExit("can't open file:".$filename,100);
    while(<FP>) {
        $line.= $_;
    }
    close(FP);
    return $line;
}

## ファイルの中身を保存する
sub file_put_contents {
    my $filename = shift(@_);
    my $line = shift(@_);
    open(FP,">".$filename) || errorExit("can't open file:".$filename,101);
    print FP $line;
    close(FP);
}

## JSONファイルのリストを取得
sub listFile {
    $path = $data_path."/*.json";
    my @list;
    foreach $filename (glob($path)) {
        my $file_cnt = file_get_contents($filename);
        my $data = $json->decode($file_cnt);
        my ($basename,$dir,$suffix) = fileparse($filename, qr/\..*$/);
        push(@list,{name => $basename,
                    title => $data->{plan}->{title},
                    purpose => $data->{plan}->{purpose},
                    deparure_date => $data->{plan}->{deparure_date},
                    status => $data->{plan}->{status},
                });
    }
    successExit(\@list);
}

# JSONデータを取得する
sub loadFile {
    my $request = shift(@_);
    my $resp;

    $name = $request->{"name"};
    $filename = $data_path."/".$name.".json";
    $file_cnt = file_get_contents($filename);

    $data = $json->decode($file_cnt);
    $resp = {name=>$name, data=>$data};
    successExit($resp);
}

# JSONデータを保存する
sub saveFile {
    my $request = shift(@_);

    $name = $request->{"name"};
    if ($name ne "_template") {
        $data = $request->{"data"};

        $enc_json = $json->encode($data);

        $filename = $data_path."/".$name.".json";
        file_put_contents($filename,$enc_json);
    }
    successExit("OK");
}
# JSONデータを削除する
sub deleteFile {
    my $request = shift(@_);

    $name = $request->{"name"};
    if ($name ne "_template") {
        $filename = $data_path."/".$name.".json";
        unlink($filename);
    }
    successExit("OK");
}

## "POSTDATA"はPOSTメソッド使用時のBODY全体
my $postdata = $cgi->param("POSTDATA");
my $request;
eval {
    ## JSONデータをパースしてPerlオブジェクトを取り出します。
    $request = $json->decode($postdata);

    $controller = $request->{controller};
    $action = $request->{action};
};
if ($@) {
    errorExit('broken data.',500);
} else {
    if ($controller ne "Store") {
        errorExit('unsupport controller.',501);
    }
    if ($action eq "list") {
        listFile($request);
    } elsif ($action eq "load") {
        loadFile($request);
    } elsif ($action eq "save") {
        saveFile($request);
    } elsif ($action eq "delete") {
        deleteFile($request);
    }
}
