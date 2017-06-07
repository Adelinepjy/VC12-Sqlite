(function () {
    var db;
    var entryid, entryDate, entryTitle, entryContent;

    $(document).ready(function () {
        db = window.openDatabase("DiaryDB", "1.0", "DiaryDB", 200000);
        db.transaction(createDB, transaction_error, createDB_success);

        $("#btnSave").bind("click", function () {
            saveEntry();
        });

        $("#btnUpdate").bind("click", function () {
            saveChanges();
        });

        $("#btnDelete").bind("click", function () {
            deleteEntry();
        });

        listEntries();
    });

    //Delete Section
    function deleteRecord(tx) {
        var deleteString = "delete from DiaryTab where entryID = " + entryid;
        tx.executeSql(deleteString);
    }

    function deleteEntry() {
        entryid = $("#hidEditid").val();
        db.transaction(deleteRecord, transaction_error, update_success);
        $.mobile.changePage('#mainpage', 'pop', true, true);
    }

    //Edit Section
    function editEntry(EntryID) {
        db.transaction(
            function (tx) {
                tx.executeSql("SELECT * FROM DiaryTab where EntryID =" + EntryID, [],
                    function (tx, result) {
                        $("#hidEditid").val(result.rows.item(0)['EntryID']);
                        $("#txtEdittitle").val(result.rows.item(0)['EntryTitle']);
                        $("#txtEditdate").val(result.rows.item(0)['EntryDate']);
                        $("#txtEditcontents").html(result.rows.item(0)['EntryContent']);
                    },
                    transaction_error
                );
            });
    }

    function saveChanges() {
        entryid = $("#hidEditid").val();
        entryDate = $("#txtEditdate").val();
        entryTitle = $("#txtEdittitle").val();
        entryContent = $("#txtEditcontents").val();

        db.transaction(updateRecord, transaction_error, update_success);
        $.mobile.changePage('#mainpage', 'pop', true, true);
    }

    function updateRecord(tx) {
        var updateString = "update DiaryTab set entryDate = '" + entryDate + "', entryTitle = '" + entryTitle + "', entryContent = '" + entryContent + "' where entryID = " + entryid;
        tx.executeSql(updateString);
    }

    function update_success() {
        listEntries();
    }

    //Listing entries Section
    function listEntries() {
        db.transaction(listRecords, transaction_error);
    }

    function listRecords(tx) {
        var result;
        $("#mybody").find("tr").remove();

        tx.executeSql("SELECT * FROM DiaryTab order by EntryDate desc", [],
            function querySuccess(tx, result) {
                var len = result.rows.length;
                for (var i = 0; i < len; i++) {
                    $("#mybody").append("<tr><td>" + result.rows.item(i)['EntryID'] + "</td><td>"
                        + result.rows.item(i)['EntryDate'] + "</td><td>"
                        + result.rows.item(i)['EntryTitle'] + "</td><td>"
                        + result.rows.item(i)['EntryContent'] + "</td><td>"
                        + "<a href='#editpage' class='ui-btn' id='btn_" + i + "'>Edit</a></td></tr>");

                    var myid = result.rows.item(i)['EntryID'];

                    $("#btn_" + i).bind("click", { id: myid }, function (event) {
                        var data = event.data;
                        editEntry(data.id);
                    });
                }
            }
            , transaction_error);
    }


    //Insert Entry Section
    function insertRecord(tx) {
        var insertString = "INSERT INTO DiaryTab (entryDate, entryTitle, entryContent) VALUES ('"
            + entryDate + "','"
            + entryTitle + "','"
            + entryContent + "')";
        tx.executeSql(insertString);
    }

    function saveEntry() {
        entryDate = $("#txtDate").val();
        entryTitle = $("#txtTitle").val();
        entryContent = $("#txtContents").val();
        db.transaction(insertRecord, transaction_error, insert_success);
    }

    function insert_success() {
        alert("Insert Success!");
        listEntries();
    }

    // Create DB Section
    function createDB(tx) {
        var sql = "CREATE TABLE IF NOT EXISTS DiaryTab ("
            + "EntryID INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "EntryDate TEXT, " + "EntryTitle TEXT, " + "EntryContent Text"
            + ")";
        tx.executeSql(sql);
    }

    function createDB_success() {
        alert("Database and Table Created");
    }

    // Shared Function Section
    function transaction_error(tx, error) {
        alert("Database Error: " + error);
    }



})();