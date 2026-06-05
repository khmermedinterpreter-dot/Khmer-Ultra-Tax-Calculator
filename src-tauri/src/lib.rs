use base64::{Engine as _, engine::general_purpose};
use std::fs::File;
use std::io::Write;

#[tauri::command]
fn save_excel_file(base64_data: String, filename: String) -> Result<String, String> {
        // Guard against excessively large payloads (limit ~10 MiB after decode)
    const MAX_DECODED_SIZE: usize = 10 * 1024 * 1024;
    if base64_data.len() > MAX_DECODED_SIZE * 2 { // rough upper bound before decode
        return Err("Base64 payload is too large".to_string());
    }
    let bytes = general_purpose::STANDARD
        .decode(base64_data)
        .map_err(|e| format!("Failed to decode base64: {}", e))?;
    if bytes.len() > MAX_DECODED_SIZE {
        return Err("Decoded file exceeds size limit".to_string());
    }

    let file_path = rfd::FileDialog::new()
        .set_file_name(&filename)
        .add_filter("Excel Worksheet", &["xlsx"])
        .save_file();

    if let Some(path) = file_path {
        let mut file = File::create(&path)
            .map_err(|e| format!("Failed to create file: {}", e))?;
        file.write_all(&bytes)
            .map_err(|e| format!("Failed to write file: {}", e))?;
        Ok(path.to_string_lossy().to_string())
    } else {
        Err("User cancelled the save dialog".to_string())
    }
}

#[tauri::command]
fn print_window(window: tauri::WebviewWindow) -> Result<(), String> {
    window.print().map_err(|e| e.to_string())

}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_excel_file, print_window])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
