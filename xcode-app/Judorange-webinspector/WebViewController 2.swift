//
//  WebViewsController.swift
//  Judorange-webinspector
//
//  Created by Julien Cuénot on 03/07/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit
import WebKit



protocol WebViewDelegate { // Child can call these methods here
    func updateBackForwardBtnStates(webView_id: Int)
    func updateUrlField(webView_id: Int)
    func updateTabName(webView_id: Int)
    func javascriptAlert(message: String)
}




class WebViewController:UIViewController, WKScriptMessageHandler, WKUIDelegate, WKNavigationDelegate {
    
    
    // CREATION D'UNE DELEGATION QUI SERA UTILISEE PAR LE CONTROLLER PARENT
    var webViewDelegate: WebViewDelegate!
    
    // USEFULL PROPERTIES
    var isInspectorVisible = false
    
    private var estimatedProgressObserver: NSKeyValueObservation? // The observation object for the progress of the web view (we only receive notifications until it is deallocated).
    
    var webView = WKWebView()
    var webView_id = Int() // must be set at construction
    var progressView = UIProgressView()
    
    public convenience init(wv_id: Int) {
        // INIT
        self.init()
        webView_id = wv_id
        
        // PROGRESS BAR SETUP
        setupProgressView()
        setupEstimatedProgressObserver()
        
        // DISABLE CACHE
        URLCache.shared.removeAllCachedResponses()
        URLCache.shared.diskCapacity = 0
        URLCache.shared.memoryCapacity = 0
        
        // DELEGATE
        webView.uiDelegate = self           //ADD WKUIDelegate to class
        webView.navigationDelegate = self   //ADD WKUIDelegate to class
        
        // DISABLE SWIPING TO NAVIGATE
        webView.allowsBackForwardNavigationGestures = false
        
        // SCALE THE PAGE TO FILL THE WEB VIEW
        webView.contentMode = .scaleToFill
        
        // LOCAL FILES ACCESS
        webView.configuration.preferences.setValue(true, forKey:"allowFileAccessFromFileURLs")
        
        // INSPECTOR DISABLE
        isInspectorVisible = false
        
    }
    
    
    
    public override func viewDidLoad() {   // loadView or viewDidLoad
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
    }
    
    
    
    func loadLocalWebsite(){
        // LOCAL WEBSITE
        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "website")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
        let request = URLRequest(url: url)
        webView.load(request)
        loadJSFiles()
    }
    
    
    
    func loadURL(str_url: String){
        // CHECK VALIDITY
        if( str_url.contains("http://") || str_url.contains("https://") ){
            let url = URL(string: str_url )!
            webView.load(URLRequest(url: url))
        }
        else{
            webView.evaluateJavaScript("alert('⚠️ URL must start with http:// or https:// ⚠️');", completionHandler: nil)
        }
        loadJSFiles()
    }
    
    
    
    func loadJSFiles(){
        // ==================== LOAD JAVASCRIPT FILES =========================
        
        func addJSFileToWebView(scriptname: String){
            // PATH TO THE FILE
            let script_file_path = Bundle.main.path(forResource: scriptname, ofType: "js")!
            // GET CONTENT OF THE FILE
            let script_content = (try? String(contentsOfFile: script_file_path))!
            // CREATE USER SCRIPT
            let WKU_script = WKUserScript(source: script_content, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            // ADD SCRIPT TO CONTENT CONTROLLER
            webView.configuration.userContentController.addUserScript(WKU_script)
        }
        
        addJSFileToWebView(scriptname:"zoomlock")
        addJSFileToWebView(scriptname:"judorange")
        addJSFileToWebView(scriptname:"judorange-init")
        
        // ====================================================================
    }
    
    
    
    // For javascript responses (not really used)
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        
        // DEBUG
        print("WebViewController : 'Hello, didReceive (javascript message)'")
        
        if message.name == "jsHandler" {
            print(message.body)
        }
    }
    
    
    
    // JAVASCRIPT ALERT
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler : @escaping () -> Void) {
        // Let manager send alert cause webview has no UI
        webViewDelegate.javascriptAlert(message: message)
        // CompletionH
        completionHandler()
    }
    
    
    
    
    // ==================== PROGRESS BAR AND OTHERS =========================
    
    private func setupProgressView() {
        
        // DEBUG
        print("WebViewController : 'Hello, setupProgressView'")
        
        progressView.translatesAutoresizingMaskIntoConstraints = false
        webView.addSubview(progressView)
        progressView.isHidden = true
        
        NSLayoutConstraint.activate([
          progressView.leadingAnchor.constraint(equalTo: webView.leadingAnchor),
          progressView.trailingAnchor.constraint(equalTo: webView.trailingAnchor),
          progressView.topAnchor.constraint(equalTo: webView.topAnchor),
          progressView.heightAnchor.constraint(equalToConstant: 2.0)
        ])
    }
    
    
    
    
    
    private func setupEstimatedProgressObserver() {
        
        // DEBUG
        print("WebViewController : 'Hello, setupEstimatedProgressObserver'")
        
        // CHANGE progress bar SIZE :
        let transform : CGAffineTransform = CGAffineTransform(scaleX: 1.0, y: 2.0)
        progressView.transform = transform
        
        estimatedProgressObserver = webView.observe(\.estimatedProgress, options: [.new]) { [weak self] webView, _ in
            self?.progressView.progress = Float(webView.estimatedProgress)
        }
        
    }
    
    
    
    
    
    func webView(_: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
        
        // DEBUG
        print("WebViewController : 'Hello, didStartProvisionalNavigation'")
        
        /// By implementing the `WKNavigationDelegate` we can update the visibility of the `progressView` according to the `WKNavigation` loading progress.
        /// The view-visibility updates are based on my gist [fxm90/UIView+AnimateIsHidden.swift](https://gist.github.com/fxm90/723b5def31b46035cd92a641e3b184f6)
        
        // Make sure our animation is visible.
        if progressView.isHidden { progressView.isHidden = false }
        
        UIView.animate(withDuration: 0.33, animations: { self.progressView.alpha = 1.0 })
    }
    
    
    
    
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        
        // DEBUG
        print("WebViewController : 'Hello, didFinish'")
        
        //webView.evaluateJavaScript("alert('Hello from evaluateJavascript()')", completionHandler: nil)
        
        // SET SEARCHBAR URL
        webViewDelegate?.updateUrlField(webView_id: webView_id)
        
        // SET TAB TITLE
        webViewDelegate?.updateTabName(webView_id: webView_id)
        
        // UPDATE BUTTON STATE
        webViewDelegate?.updateBackForwardBtnStates(webView_id: webView_id)
        
        // INSPECTOR DISABLE
        isInspectorVisible = false // Warning must be somewhere maybe here
        
        // UPDATE PROGRESS BAR
        UIView.animate(withDuration: 0.33,
          animations: {
            self.progressView.alpha = 0.0
          },
          completion: {
            isFinished in
            // Update `isHidden` flag accordingly:
            //  - set to `true` in case animation was completly finished.
            //  - set to `false` in case animation was interrupted, e.g. due to starting of another animation.
            self.progressView.isHidden = isFinished
        })
        
    }
    // ====================================================================
    
    
    
} // End of class


