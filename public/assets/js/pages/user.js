 
    // start function
    $(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // get data
    var table = $('.data-table').DataTable({
    processing: true,
    serverSide: true,
    ajax: "<?= route('user.index') ?>",
    columns: [
        {data: 'DT_RowIndex', name: 'DT_RowIndex'},
        {data: 'name', name: 'name'},
        {data: 'email', name: 'email'},
        {data: 'role', name: 'role'},
        {data: 'action', name: 'action', orderable: false, searchable: false},
    ]
    });
    // end 

    // edit data
    $('body').on('click', '.editData', function () {

        var data_id = $(this).data('id');
        $.get("{{ route('user.index') }}" +'/' + data_id +'/edit', function (data) {

            $('#saveBtn').html("Update");  
            $('#modalHeading').html("Edit Data");
            $('#modalBox').modal('show');
            $("#errors-validate").hide();
            $('#saveBtn').prop('disabled', false);
            // get data respone
            $('#data_id').val(data.id);
            $('#name').val(data.name);
            $('#email').val(data.email);
            $('#role').val(data.role);
           
        })

        });

    // end
    
    // button create new data
    $('#createNewData').click(function () {
        $('#saveBtn').html("Save");
        $('#data_id').val('');
        $('#dataForm').trigger("reset");
        $('#modalHeading').html("Tambah Data");
        $('#modalBox').modal('show');
        $("#errors-validate").hide();
        $('#saveBtn').prop('disabled', false);
    });
    // end 

    // store process
    if ($("#dataForm").length > 0) {
            $("#dataForm").validate({
                submitHandler: function(form) {

                    // button action
                    var actionType = $('#saveBtn').val();
                    $('#saveBtn').html('Sending..');
                    $('#saveBtn').prop('disabled', true);
                    // end 

                    $.ajax({
                    data: $('#dataForm').serialize(),
                    url: "{{ route('user.store') }}",
                    type: "POST",
                    dataType: 'json',
                    success: function (data) {

                        if(data.status == 'sukses'){
                            $('#modalBox').modal('hide');
                            Swal.fire("Selamat", data.message , "success");
                            $('#dataForm').trigger("reset");
                            table.draw();

                        }else{
                        $('#message-error').html(data.message).show()
                        }
                    },
                    error:function(xhr, status, error)  {
                        $.each(xhr.responseJSON.errors, function (key, item) 
                        {
                            $("#errors-validate").show();
                            $("#errors-validate").append("<li class='list-group-item list-group-item-danger'>"+item+"</li>")
                        }); 
                    }
                });

                }
            })
        }

    // end
    
    // delete
    $('body').on('click', '.deleteData', function () {

        var data_id = $(this).data("id");
        Swal.fire({
        title: "Apa kamu yakin?",
        text: "Menghapus data ini!",
        icon: "warning",
        buttons: [
        'Tidak',
        'Iya'
        ],
        dangerMode: true,
        }).then(function(isConfirm) {
        if (isConfirm) {
        Swal.fire({
        title: 'Selamat!',
        text: 'Data berhasil di hapus!',
        icon: 'success'
        }).then(function() {
            $.ajax({
                type: "DELETE",
                url: "{{ route('user.store') }}"+'/'+data_id,
                success: function (data) {
                    table.draw();
                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        });
        } else {
        Swal.fire("Cencel", "Data tidak jadi dihapus :)", "error");
        }
        })


        });

    // end

    // end function 
    });