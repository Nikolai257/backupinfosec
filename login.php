<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── DATABASE CONNECTION ─────────────────────────────────────
$host        = "localhost";
$dbname      = "unikodb";
$db_username = "root";
$db_password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $db_username, $db_password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    $username = isset($data['username']) ? trim($data['username']) : "";
    $password = isset($data['password']) ? $data['password'] : "";
    // ← FIXED: no longer reads role from frontend at all

    // ─── EMPTY CHECK ────────────────────────────────────────────
    if ($username === "" || $password === "") {
        echo json_encode([
            "success" => false,
            "message" => "Please fill in all fields."
        ]);
        exit();
    }

    // ─── FIND USER BY USERNAME ONLY ─────────────────────────────
    // ← FIXED: was "WHERE username = ? AND role = ?"
    //          role from frontend was always empty so it never matched
    $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid credentials."
        ]);
        exit();
    }

    // ─── VERIFY PASSWORD ────────────────────────────────────────
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid credentials."
        ]);
        exit();
    }

    // ─── SUCCESS – role comes from the database row ─────────────
    echo json_encode([
        "success"  => true,
        "message"  => "Login successful.",
        "user_id"  => $user['id'],
        "username" => $user['username'],
        "role"     => $user['role']    // ← this is what Login.jsx uses to redirect
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>