#[tauri::mobile_entry_point]
fn main() {
  tauri::Builder::default()
  .plugin(tauri_plugin_notification::init())
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}