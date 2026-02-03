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
$host     = "localhost";
$dbname   = "unikodb";          // ← FIXED: was "your_database_name"
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// ─── READ INPUT ──────────────────────────────────────────────
$input = json_decode(file_get_contents("php://input"), true);

$username_input = isset($input["username"]) ? trim($input["username"]) : "";
$password_input = isset($input["password"]) ? $input["password"] : "";
$role_input     = isset($input["role"])     ? trim($input["role"])     : "";

// ─── VALIDATION ──────────────────────────────────────────────
if ($username_input === "" || $password_input === "" || $role_input === "") {
    echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
    exit;
}

if (strlen($username_input) > 100) {
    echo json_encode(["success" => false, "message" => "Username must not exceed 100 characters."]);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_]+$/', $username_input)) {
    echo json_encode(["success" => false, "message" => "Username can only contain letters, numbers, and underscores."]);
    exit;
}

if (strlen($password_input) < 8 || strlen($password_input) > 12) {
    echo json_encode(["success" => false, "message" => "Password must be between 8 and 12 characters."]);
    exit;
}

if ($role_input !== "client" && $role_input !== "employee") {
    echo json_encode(["success" => false, "message" => "Invalid role selected."]);
    exit;
}

// ─── CHECK DUPLICATE USERNAME ────────────────────────────────
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username_input]);

    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Username is already taken."]);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error checking username."]);
    exit;
}

// ─── HASH PASSWORD & INSERT ──────────────────────────────────
$hashed_password = password_hash($password_input, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->execute([$username_input, $hashed_password, $role_input]);

    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Failed to create account."]);
}
?>