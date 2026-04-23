<?php
add_action('init', function() {
    header("Access-Control-Allow-Origin: http://localhost:5173"); // Cho phép React truy cập
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    
    // Xử lý các request OPTIONS (Preflight)
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        exit;
    }
});
/**
 * Toocheke functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Toocheke
 */

if( ! defined( 'ABSPATH' ) ) exit;


/**
 * Toocheke Functions
 *
 * @since Toocheke v1.0.15
 */
 //Load theme functions
 require_once get_template_directory() . '/inc/toocheke-functions.php';
 /**
  * Note: Do not add any custom code here. Please use a child theme so that your customizations aren't lost during updates.
  * http://codex.wordpress.org/Child_Themes
  */
  
 // Ép plugin Toocheke phải nhả API cho Chương truyện
add_filter('register_post_type_args', function($args, $post_type) {
    if ($post_type === 'manga_chapter') {
        $args['show_in_rest'] = true;
        $args['rest_base'] = 'manga-chapter-api'; 
        // Dòng quan trọng: Ép hiện ô nội dung (editor) ra API
        $args['supports'] = array_merge($args['supports'], array('editor', 'revisions', 'thumbnail'));
    }
    return $args;
}, 10, 2);
add_filter('rest_prepare_manga_chapter', function($response, $post, $request) {
    // 1. Thử các "ngăn kéo" phổ biến của Toocheke
    $keys_to_test = array('chapter_pages', '_chapter_pages', 'toocheke_chapter_pages', 'images');
    $images = [];
    
    foreach ($keys_to_test as $key) {
        $data = get_post_meta($post->ID, $key, true);
        if (!empty($data)) {
            // Nếu là mảng ID ảnh thì chuyển thành URL, nếu là chuỗi thì tách ra
            $ids = is_array($data) ? $data : explode(',', $data);
            foreach ($ids as $img_id) {
                $url = wp_get_attachment_url(trim($img_id));
                if ($url) $images[] = $url;
            }
            if (!empty($images)) break;
        }
    }
    
    // 2. Nếu vẫn không thấy, quét toàn bộ ảnh được đính kèm vào bài viết này
    if (empty($images)) {
        $attachments = get_attached_media('image', $post->ID);
        foreach ($attachments as $attachment) {
            $images[] = wp_get_attachment_url($attachment->ID);
        }
    }

    // 3. Trả về mảng ảnh cho Vui
    $response->data['images_url'] = $images;
    return $response;
}, 10, 3);
// Lọc chương chuẩn xác theo ID truyện (series_id)
add_filter('rest_manga_chapter_query', function($args, $request) {
    // Nhận số ID từ React của Vui gửi lên (ví dụ: 64)
    $manga_series_id = $request->get_param('manga_series');
    
    if (!empty($manga_series_id)) {
        // Tra đúng "ổ khóa" series_id mà anh em mình vừa tìm được
        $args['meta_query'] = array(
            array(
                'key'     => 'series_id', 
                'value'   => $manga_series_id,
                'compare' => '='
            )
        );
    }
    return $args;
}, 10, 2);
// Tạo một API mini chuyên để lấy mô tả truyện
add_action('rest_api_init', function () {
    register_rest_route('truyen/v1', '/mota/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $id = $request['id'];

            // Thử móc mô tả nếu truyện được lưu dạng Taxonomy (Nhãn)
            $term = get_term($id, 'manga_series');
            if ($term && !is_wp_error($term) && !empty($term->description)) {
                return array('description' => wpautop($term->description));
            }

            // Thử móc mô tả nếu truyện được lưu dạng Post Type (Bài viết)
            $post = get_post($id);
            if ($post && !empty($post->post_content)) {
                return array('description' => wpautop($post->post_content));
            }

            return array('description' => 'Đang cập nhật nội dung cho bộ truyện này...');
        }
    ));
});
// Tạo API tăng lượt xem cho truyện
add_action('rest_api_init', function () {
    register_rest_route('truyen/v1', '/tang-view/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => function($request) {
            $manga_id = $request['id'];
            
            // 1. Lấy số view hiện tại trong database (nếu chưa có thì là 0)
            $current_views = get_post_meta($manga_id, 'post_views_count', true);
            if ($current_views == '') {
                $current_views = 0;
            }
            
            // 2. Tăng view lên 1
            $new_views = intval($current_views) + 1;
            
            // 3. Lưu ngược lại vào database
            update_post_meta($manga_id, 'post_views_count', $new_views);
            
            return array(
                'success' => true, 
                'manga_id' => $manga_id, 
                'new_views' => $new_views
            );
        }
    ));
});

// Tạo API lấy Top 10 Truyện nhiều view nhất
add_action('rest_api_init', function () {
    register_rest_route('truyen/v1', '/top-truyen', array(
        'methods' => 'GET',
        'callback' => function() {
            $args = array(
                // Lấy các bài viết có chứa meta_key đếm view
                'meta_key'       => 'post_views_count',
                'orderby'        => 'meta_value_num', // Sắp xếp theo giá trị số
                'order'          => 'DESC',           // Từ cao xuống thấp
                'posts_per_page' => 10,               // Lấy top 10 bộ
                'post_type'      => 'any',            // Quét mọi loại truyện
            );
            
            $query = new WP_Query($args);
            $top_comics = array();
            
            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    $top_comics[] = array(
                        'id'        => get_the_ID(),
                        'title'     => get_the_title(),
                        'thumbnail' => get_the_post_thumbnail_url() ?: '',
                        // Nếu không có view thì mặc định là 0
                        'views'     => get_post_meta(get_the_ID(), 'post_views_count', true) ?: 0 
                    );
                }
            }
            wp_reset_postdata();
            
            return $top_comics;
        }
    ));
});

// 1. Khai báo API Đăng Ký Tài Khoản
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/dang-ky', array(
        'methods' => 'POST',
        'callback' => 'tu_tien_dang_ky_user',
        'permission_callback' => '__return_true' // Cho phép ai cũng gọi được API này
    ));
});

// 2. Logic xử lý Đăng Ký & Tạo "Đan Điền"
function tu_tien_dang_ky_user($request) {
    $parameters = $request->get_json_params();
    $username = sanitize_text_field($parameters['username']); // Vui sẽ gửi SĐT vào đây
    $password = sanitize_text_field($parameters['password']);

    // Kiểm tra dữ liệu rỗng
    if (empty($username) || empty($password)) {
        return new WP_Error('thieu_thong_tin', 'Vui lòng nhập đủ Số điện thoại và Mật khẩu', array('status' => 400));
    }

    // Kiểm tra xem SĐT này đã có người đăng ký chưa
    if (username_exists($username)) {
        return new WP_Error('da_ton_tai', 'Số điện thoại này đã có đạo hữu sử dụng!', array('status' => 400));
    }

    // Tạo User mới trong hệ thống WordPress
    $user_id = wp_create_user($username, $password, $username . '@truyentranh.local');

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    // ---------------------------------------------------------
    // KHỞI TẠO "LINH CĂN" CHO TÀI KHOẢN MỚI
    // ---------------------------------------------------------
    // 1. Cấp điểm kinh nghiệm ban đầu = 0
    update_user_meta($user_id, 'tu_vi_exp', 0); 
    
    // 2. Tạo mảng rỗng để sau này lưu lịch sử đọc
    update_user_meta($user_id, 'lich_su_doc', array()); 
    
    // 3. Tạo mảng rỗng để sau này lưu truyện theo dõi
    update_user_meta($user_id, 'truyen_theo_doi', array()); 

    return array(
        'status' => 200,
        'message' => 'Đăng ký thành công! Chào mừng đạo hữu bước vào con đường tu tiên.',
        'user_id' => $user_id
    );
}

// 1. Khai báo API Lấy Hồ Sơ (Yêu cầu phải có Lệnh bài JWT mới gọi được)
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/ho-so', array(
        'methods' => 'GET',
        'callback' => 'tu_tien_lay_ho_so',
        // Hàm này tự động kiểm tra xem request có kẹp Token hợp lệ hay không
        'permission_callback' => function () {
            return is_user_logged_in(); 
        }
    ));
});

// 2. Logic lấy dữ liệu từ "Đan Điền" trả về cho React
function tu_tien_lay_ho_so($request) {
    $user_id = get_current_user_id();
    $user_info = get_userdata($user_id);

    // 1. Lấy EXP thật từ Database (Dùng key tu_vi_exp cho đồng bộ)
    $exp = get_user_meta($user_id, 'tu_vi_exp', true) ?: 0;
    
    // 2. Gọi hàm tính Cảnh Giới chuẩn (Sửa lỗi truy xuất mảng ở đây)
    $canh_gioi_data = tu_tien_tinh_canh_gioi((int)$exp);

    // 3. Lấy chi tiết Truyện Theo Dõi
    $followed_ids = get_user_meta($user_id, 'truyen_theo_doi', true) ?: array();
    $followed_comics = array();
    foreach($followed_ids as $cid) {
        $followed_comics[] = array(
            'id' => $cid,
            'title' => get_the_title($cid),
            'image' => get_the_post_thumbnail_url($cid, 'thumbnail') ?: "https://via.placeholder.com/150x200"
        );
    }

    // 4. Móc dữ liệu Lịch sử đọc
    $history_meta = get_user_meta($user_id, 'lich_su_doc', true) ?: array();
    $history_list = array();
    foreach (array_reverse($history_meta, true) as $cid => $info) {
        $history_list[] = array(
            'id' => $cid,
            'title' => get_the_title($cid),
            'image' => get_the_post_thumbnail_url($cid, 'thumbnail') ?: "https://via.placeholder.com/100",
            'last_chapter' => $info['chapter']
        );
    }

    // 5. Đóng gói trả về (Đảm bảo các key khớp với Profile.jsx)
    return array(
        'status' => 200,
        'display_name' => $user_info->display_name,
        'phone' => $user_info->user_login,
        'avatar' => get_avatar_url($user_id), // Thêm avatar thật từ WP
        'exp' => (int)$exp,
        'level' => $canh_gioi_data['level'], // Lấy từ hàm bổ trợ
        'exp_next_level' => $canh_gioi_data['next'], // Lấy từ hàm bổ trợ
        'lich_su' => $history_list,
        'theo_doi' => $followed_comics
    );
}

// --- 2. HÀM CỘNG EXP & LƯU LỊCH SỬ (Phải có tham số gửi từ React) ---
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/cong-exp', array(
        'methods' => 'POST',
        'callback' => 'tu_tien_cong_exp',
        'permission_callback' => function () { return is_user_logged_in(); }
    ));
});

// 2. Logic xử lý "Bơm" Tu Vi
function tu_tien_cong_exp($request) {
    $user_id = get_current_user_id();
    $params = $request->get_json_params();
    $comic_id = isset($params['comic_id']) ? (int)$params['comic_id'] : 0;
    $chapter_name = isset($params['chapter_name']) ? sanitize_text_field($params['chapter_name']) : "Chương 1";

    // Cộng EXP
    $current_exp = get_user_meta($user_id, 'tu_vi_exp', true) ?: 0;
    update_user_meta($user_id, 'tu_vi_exp', (int)$current_exp + 10);

    // Lưu lịch sử vào database
    if ($comic_id > 0) {
        $history = get_user_meta($user_id, 'lich_su_doc', true) ?: array();
        $history[$comic_id] = array(
            'chapter' => $chapter_name,
            'time' => current_time('mysql')
        );
        update_user_meta($user_id, 'lich_su_doc', $history);
    }

    return array('status' => 200, 'message' => 'Đã ghi danh vào nhật ký tu luyện!');
}

// 1. Khai báo API Theo Dõi Truyện
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/theo-doi', array(
        'methods' => 'POST',
        'callback' => 'tu_tien_xu_ly_theo_doi',
        'permission_callback' => function () {
            return is_user_logged_in(); // Bắt buộc phải có Lệnh bài
        }
    ));
});

// 2. Logic xử lý Thêm/Xóa khỏi Tàng Kinh Các
function tu_tien_xu_ly_theo_doi($request) {
    $user_id = get_current_user_id();
    $parameters = $request->get_json_params();
    $comic_id = isset($parameters['comic_id']) ? (int)$parameters['comic_id'] : 0;

    if ($comic_id === 0) {
        return new WP_Error('loi_du_lieu', 'Không tìm thấy ID truyện', array('status' => 400));
    }

    // Lấy danh sách truyện đang theo dõi hiện tại
    $followed = get_user_meta($user_id, 'truyen_theo_doi', true);
    if (!is_array($followed)) $followed = array();

    $is_followed = false;
    $message = "";

    // Kiểm tra xem truyện này đã có trong danh sách chưa
    if (in_array($comic_id, $followed)) {
        // Nếu ĐÃ có -> Bấm vào là BỎ THEO DÕI
        $followed = array_diff($followed, array($comic_id));
        $message = "Đã bỏ theo dõi truyện này!";
    } else {
        // Nếu CHƯA có -> Bấm vào là THÊM THEO DÕI
        $followed[] = $comic_id;
        $is_followed = true;
        $message = "Đã thêm vào Tàng Kinh Các!";
    }

    // Lưu lại danh sách mới vào Database
    update_user_meta($user_id, 'truyen_theo_doi', $followed);

    return array(
        'status' => 200,
        'message' => $message,
        'is_followed' => $is_followed,
        'danh_sach_moi' => $followed
    );
}
// TẠO API LẤY DANH SÁCH TRUYỆN + 2 CHAP MỚI + VIEW + LIKE
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/truyen-trang-chu', array(
        'methods' => 'GET',
        'callback' => 'tu_tien_api_trang_chu',
        'permission_callback' => '__return_true'
    ));
});

function tu_tien_api_trang_chu() {
    // 1. Lấy 100 bộ truyện mới nhất
    $args = array(
        'post_type' => 'manga_series', // Nhớ kiểm tra lại chữ này là 'manga' hay 'post' nhé Nhân
        'posts_per_page' => 100,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
    );
    $query = new WP_Query($args);
    $comics = array();

    foreach ($query->posts as $post) {
        // 2. Lấy số View và Like
        $views = get_post_meta($post->ID, 'post_views_count', true) ?: 0;
        $likes = get_post_meta($post->ID, 'likes', true) ?: 0;

        // 3. Móc 2 Chương mới nhất (Dùng series_id chuẩn của Toocheke)
        $chap_args = array(
            'post_type' => 'manga_chapter', 
            'posts_per_page' => 2,
            'orderby' => 'date',
            'order' => 'DESC',
            'meta_query' => array(
                array(
                    'key'     => 'series_id', 
                    'value'   => $post->ID,
                    'compare' => '='
                )
            )
        );
        $chap_query = new WP_Query($chap_args);
        $chapters = array();
        
        foreach ($chap_query->posts as $chap) {
            $chapters[] = array(
                'id' => $chap->ID,
                'name' => $chap->post_title,
                'time' => human_time_diff(get_the_time('U', $chap->ID), current_time('timestamp')) . ' trước'
            );
        }

        // 4. Đóng gói gửi cho React
        $comics[] = array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'thumbnail' => get_the_post_thumbnail_url($post->ID, 'medium') ?: "",
            'views' => (int)$views,
            'likes' => (int)$likes,
            'chapters' => $chapters
        );
    }
    return rest_ensure_response($comics);
}
// TẠO API ĐỔI TÊN NGƯỜI DÙNG (Bản bảo mật chuẩn)
add_action('rest_api_init', function () {
    register_rest_route('tu-tien/v1', '/doi-ten', array(
        'methods' => 'POST',
        'callback' => 'tu_tien_doi_ten',
        // Bắt buộc phải trình Lệnh bài (Token) ra mới cho vào
        'permission_callback' => function () {
            return is_user_logged_in(); 
        }
    ));
});

function tu_tien_doi_ten($request) {
    // Tự động nhận diện Đạo hữu nào đang gọi API qua Token
    $user_id = get_current_user_id(); 
    $params = $request->get_json_params();
    $new_name = isset($params['new_name']) ? sanitize_text_field($params['new_name']) : '';

    if ($user_id == 0 || empty($new_name)) {
        return new WP_Error('loi', 'Vui lòng cung cấp đủ thông tin', array('status' => 400));
    }

    // Cập nhật tên vào Database
    wp_update_user(array('ID' => $user_id, 'display_name' => $new_name));

    return array('success' => true, 'new_name' => $new_name);
}
// 1. BỔ SUNG HÀM TÍNH CẢNH GIỚI
if (!function_exists('tu_tien_tinh_canh_gioi')) {
    function tu_tien_tinh_canh_gioi($exp) {
        if ($exp < 100) return array('level' => 'Luyện Khí Kỳ', 'next' => 100);
        if ($exp < 500) return array('level' => 'Trúc Cơ Kỳ', 'next' => 500);
        if ($exp < 2000) return array('level' => 'Kim Đan Kỳ', 'next' => 2000);
        return array('level' => 'Nguyên Anh Kỳ', 'next' => 5000);
    }
}






