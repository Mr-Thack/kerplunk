use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
  };
  
  #[cfg(target_os = "ios")]
  tauri::ios_plugin_binding!(init_plugin_example);
  
  pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("AndroidNotifications")
      .setup(|app, api| {
        #[cfg(target_os = "android")]
        api.register_android_plugin("com.tauri.app", "notifications")?;
        #[cfg(target_os = "ios")]
        api.register_ios_plugin(init_plugin_example)?;
        Ok(())
      })
      .build()
  }