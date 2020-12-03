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
    func updateBackForwardBtnStates(sender: WebViewController)
    func updateUrlField(sender: WebViewController)
    func updateTabName(sender: WebViewController)
    func javascriptAlertPresent(alertController: UIAlertController)
    func newHistory(url: String)
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
    
    var history:Array<String> = Array()
    
    
    
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
        
        // USER AGENT
        webView.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15"
        
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
        var request = URLRequest(url: url)
        webView.load(request)
        loadJSFiles()
        
        // GET HISTORY
        let defaults = UserDefaults.standard
        history = defaults.stringArray(forKey: "History") ?? [String]()
        
        // CLEAR HISTORY
        var history_line = "document.getElementById('history').innerHTML='';"
        // CREATE USER SCRIPT
        var WKU_history_line = WKUserScript(source: history_line, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        // ADD SCRIPT TO CONTENT CONTROLLER
        webView.configuration.userContentController.addUserScript(WKU_history_line)
        
        // ADD HISTORY
        for url in history{
            history_line = "document.getElementById('history').innerHTML+='<li><a href=\""+url+"\">"+url+"</a></li>';"
            // CREATE USER SCRIPT
            WKU_history_line = WKUserScript(source: history_line, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            // ADD SCRIPT TO CONTENT CONTROLLER
            webView.configuration.userContentController.addUserScript(WKU_history_line)
        }
        
    }
    
    
    
    func loadURL(str_url: String){
        
        // CHECK VALIDITY
        if( str_url.contains("http://") || str_url.contains("https://") ){
            let url = URL(string: str_url )!
            let request = URLRequest(url: url)
            webView.load(request)
        }
        else{
            let js = "alert('⚠️ Check URL ⚠️\\n\\nAllowed : http:// or https://');"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
        loadJSFiles()
    }
    
    
    
    func loadJSFiles(){
        // ==================== LOAD JAVASCRIPT FILES =========================
        
        func addJSFileToWebView(scriptname: String, injtime: String){
            // PATH TO THE FILE
            let script_file_path = Bundle.main.path(forResource: scriptname, ofType: "js")!
            // GET CONTENT OF THE FILE
            let script_content = (try? String(contentsOfFile: script_file_path))!
            // CREATE USER SCRIPT
            //var WKU_script = WKUserScript(source: script_content, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            // SET TIME TO ADD SCRIPT
            if injtime == "start"{
                let WKU_script = WKUserScript(source: script_content, injectionTime: .atDocumentStart, forMainFrameOnly: true)
                // ADD SCRIPT TO CONTENT CONTROLLER
                webView.configuration.userContentController.addUserScript(WKU_script)
            }
            else if injtime == "end"{
                let WKU_script = WKUserScript(source: script_content, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
                // ADD SCRIPT TO CONTENT CONTROLLER
                webView.configuration.userContentController.addUserScript(WKU_script)
            }
        }
        
        addJSFileToWebView(scriptname:"catch_startup_errors", injtime: "start") // To retrieve first errors before inspector was loaded
        addJSFileToWebView(scriptname:"zoomlock", injtime: "end") // add meta to look zoom
        addJSFileToWebView(scriptname:"judorange", injtime: "end") // create element into shadow dom
        addJSFileToWebView(scriptname:"judorange-init", injtime: "end") // eruda.init()
        addJSFileToWebView(scriptname:"judorange-check", injtime: "end") // alert if error
        addJSFileToWebView(scriptname:"retrieve_startup_errors", injtime: "end") // To retrieve first errors before inspector was loaded
        
        
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
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
            completionHandler()
        }))
        
        //present(alertController, animated: true, completion: nil)
        webViewDelegate.javascriptAlertPresent(alertController: alertController)
    }
    
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
            completionHandler(true)
        }))
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .default, handler: { (action) in
            completionHandler(false)
        }))
        
        //present(alertController, animated: true, completion: nil)
        webViewDelegate.javascriptAlertPresent(alertController: alertController)
        
    }
    
    
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        
        let alertController = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        
        alertController.addTextField { (textField) in
            textField.text = defaultText
        }
        
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
            if let text = alertController.textFields?.first?.text {
                completionHandler(text)
            } else {
                completionHandler(defaultText)
            }
        }))
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .default, handler: { (action) in
            completionHandler(nil)
        }))
        
        //present(alertController, animated: true, completion: nil)
        webViewDelegate.javascriptAlertPresent(alertController: alertController)
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
          progressView.heightAnchor.constraint(equalToConstant: 3.0)
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
    
    
    
    
    
    // OPEN IN NEW TAB -> OPEN IN CURRENT WEB VIEW
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame == nil{ webView.load(navigationAction.request) }
        return nil
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
        webViewDelegate?.updateUrlField(sender: self)
        
        // SET TAB TITLE
        webViewDelegate?.updateTabName(sender: self)
        
        // UPDATE BUTTON STATE
        webViewDelegate?.updateBackForwardBtnStates(sender: self)
        
        // INSPECTOR DISABLE
        isInspectorVisible = false // Warning must be somewhere maybe here
        
        // SAVE HISTORY
        webViewDelegate?.newHistory(url: webView.url?.absoluteString ?? "error")
        
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
    
    
    
    // ALERT USER WHEN SERVER UNREACHABLE
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        webView.evaluateJavaScript("alert('⚠️ Check URL ⚠️\\n\\nServer unreachable');", completionHandler: nil)
    }
    
    
    
    // WORK WITH HEADERS
    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        
        /*
        if let response = navigationResponse.response as? HTTPURLResponse {
            // ALERT USER INSPECTOR CANT BE LOAD HERE
            let headers = response.allHeaderFields
            //value(forHTTPHeaderField: "Content-Security-Policy")
            print("- - - - - - - - - -")
            print(headers)
            print("- - - - - - - - - -")
        }
        */
        
        decisionHandler(.allow)
    }
    
    
    
} // End of class


