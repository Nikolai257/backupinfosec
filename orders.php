<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = mysqli_connect('localhost', 'root', '', 'unikodb');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? 'Guest';
$total = $data['total'] ?? 0;
$items = $data['items'] ?? [];

if (empty($items)) {
    echo json_encode(['success' => false, 'message' => 'No items']);
    exit;
}

// Start transaction
mysqli_begin_transaction($conn);

try {
    // Insert order
    $sql = "INSERT INTO orders (username, total, status, created_at) VALUES (?, ?, 'pending', NOW())";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'sd', $username, $total);
    mysqli_stmt_execute($stmt);
    
    $order_id = mysqli_insert_id($conn);
    
    // Insert order items
    $sql2 = "INSERT INTO order_items (order_id, product_name, product_price, quantity, subtotal, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    $stmt2 = mysqli_prepare($conn, $sql2);
    
    foreach ($items as $item) {
        $subtotal = $item['price'] * $item['quantity'];
        mysqli_stmt_bind_param($stmt2, 'isdid', $order_id, $item['name'], $item['price'], $item['quantity'], $subtotal);
        mysqli_stmt_execute($stmt2);
    }
    
    mysqli_commit($conn);
    
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $order_id
    ]);
    
} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

mysqli_close($conn);
?>