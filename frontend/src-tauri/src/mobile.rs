mod notifications;

#[tauri::mobile_entry_point]

fn main() {
  tauri::Builder::default()
  .plugin(notifications::init())
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}